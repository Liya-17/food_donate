const Request = require('../models/Request');
const Donation = require('../models/Donation');
const Notification = require('../models/Notification');

// @desc    Create a donation request
// @route   POST /api/requests
// @access  Private
exports.createRequest = async (req, res) => {
  try {
    const { donationId, pickupTime, numberOfServingsNeeded, purpose, message } = req.body;

    // Check if donation exists
    const donation = await Donation.findById(donationId);
    if (!donation) {
      return res.status(404).json({
        success: false,
        message: 'Donation not found'
      });
    }

    // Check if donation is available
    if (donation.status !== 'available') {
      return res.status(400).json({
        success: false,
        message: 'Donation is not available'
      });
    }

    // Check if user is trying to request their own donation
    if (donation.donor.toString() === req.user._id.toString()) {
      return res.status(400).json({
        success: false,
        message: 'Cannot request your own donation'
      });
    }

    // Check if user already has a pending request for this donation
    const existingRequest = await Request.findOne({
      donation: donationId,
      requester: req.user._id,
      status: 'pending'
    });

    if (existingRequest) {
      return res.status(400).json({
        success: false,
        message: 'You already have a pending request for this donation'
      });
    }

    // Create request
    const request = await Request.create({
      donation: donationId,
      requester: req.user._id,
      donor: donation.donor,
      pickupTime,
      numberOfServingsNeeded,
      purpose,
      message
    });

    // Create notification for donor
    await Notification.create({
      recipient: donation.donor,
      sender: req.user._id,
      type: 'donation_request',
      title: 'New Donation Request',
      message: `${req.user.name} has requested your donation: ${donation.title}`,
      relatedDonation: donationId,
      relatedRequest: request._id,
      priority: 'high'
    });

    // Emit socket event
    if (req.io) {
      req.io.to(donation.donor.toString()).emit('new_request', {
        request: await request.populate('requester', 'name phone organizationType')
      });
    }

    res.status(201).json({
      success: true,
      message: 'Request created successfully',
      data: request
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get all requests (for donor or receiver)
// @route   GET /api/requests
// @access  Private
exports.getRequests = async (req, res) => {
  try {
    const { status, type = 'received' } = req.query; // type: 'received' (as donor) or 'sent' (as requester)

    const query = {};

    if (type === 'received') {
      query.donor = req.user._id;
    } else {
      query.requester = req.user._id;
    }

    if (status) {
      query.status = status;
    }

    const requests = await Request.find(query)
      .populate('donation', 'title category foodType quantity servings images status')
      .populate('requester', 'name phone email organizationType avatar')
      .populate('donor', 'name phone email')
      .sort('-createdAt');

    res.json({
      success: true,
      count: requests.length,
      data: requests
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get single request
// @route   GET /api/requests/:id
// @access  Private
exports.getRequest = async (req, res) => {
  try {
    const request = await Request.findById(req.params.id)
      .populate('donation')
      .populate('requester', 'name phone email organizationType address avatar')
      .populate('donor', 'name phone email');

    if (!request) {
      return res.status(404).json({
        success: false,
        message: 'Request not found'
      });
    }

    // Check authorization
    if (
      request.donor.toString() !== req.user._id.toString() &&
      request.requester.toString() !== req.user._id.toString() &&
      req.user.role !== 'admin'
    ) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view this request'
      });
    }

    res.json({
      success: true,
      data: request
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Accept request
// @route   PUT /api/requests/:id/accept
// @access  Private
exports.acceptRequest = async (req, res) => {
  try {
    const request = await Request.findById(req.params.id).populate('donation');

    if (!request) {
      return res.status(404).json({
        success: false,
        message: 'Request not found'
      });
    }

    // Only donor can accept
    if (request.donor.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Only donor can accept requests'
      });
    }

    if (request.status !== 'pending') {
      return res.status(400).json({
        success: false,
        message: 'Request is not pending'
      });
    }

    // Update request
    request.status = 'accepted';
    request.responseMessage = req.body.responseMessage;
    request.respondedAt = Date.now();
    await request.save();

    // Update donation
    const donation = await Donation.findById(request.donation._id);
    donation.status = 'claimed';
    donation.claimedBy = request.requester;
    donation.claimedAt = Date.now();
    await donation.save();

    // Reject all other pending requests for this donation
    await Request.updateMany(
      {
        donation: request.donation._id,
        _id: { $ne: request._id },
        status: 'pending'
      },
      {
        status: 'rejected',
        responseMessage: 'Donation has been claimed by another user',
        respondedAt: Date.now()
      }
    );

    // Create notification for requester
    await Notification.create({
      recipient: request.requester,
      sender: req.user._id,
      type: 'request_accepted',
      title: 'Request Accepted',
      message: `Your request for "${donation.title}" has been accepted`,
      relatedDonation: donation._id,
      relatedRequest: request._id,
      priority: 'high'
    });

    // Emit socket event
    if (req.io) {
      req.io.to(request.requester.toString()).emit('request_accepted', {
        request,
        donation
      });
    }

    res.json({
      success: true,
      message: 'Request accepted successfully',
      data: request
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Reject request
// @route   PUT /api/requests/:id/reject
// @access  Private
exports.rejectRequest = async (req, res) => {
  try {
    const request = await Request.findById(req.params.id);

    if (!request) {
      return res.status(404).json({
        success: false,
        message: 'Request not found'
      });
    }

    // Only donor can reject
    if (request.donor.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Only donor can reject requests'
      });
    }

    if (request.status !== 'pending') {
      return res.status(400).json({
        success: false,
        message: 'Request is not pending'
      });
    }

    request.status = 'rejected';
    request.responseMessage = req.body.responseMessage;
    request.respondedAt = Date.now();
    await request.save();

    // Create notification
    await Notification.create({
      recipient: request.requester,
      sender: req.user._id,
      type: 'request_rejected',
      title: 'Request Rejected',
      message: `Your request has been rejected`,
      relatedRequest: request._id,
      relatedDonation: request.donation
    });

    res.json({
      success: true,
      message: 'Request rejected successfully',
      data: request
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Cancel request
// @route   PUT /api/requests/:id/cancel
// @access  Private
exports.cancelRequest = async (req, res) => {
  try {
    const request = await Request.findById(req.params.id);

    if (!request) {
      return res.status(404).json({
        success: false,
        message: 'Request not found'
      });
    }

    // Only requester can cancel
    if (request.requester.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Only requester can cancel their request'
      });
    }

    if (request.status !== 'pending') {
      return res.status(400).json({
        success: false,
        message: 'Can only cancel pending requests'
      });
    }

    request.status = 'cancelled';
    request.cancellationReason = req.body.reason;
    request.cancelledAt = Date.now();
    await request.save();

    res.json({
      success: true,
      message: 'Request cancelled successfully',
      data: request
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
