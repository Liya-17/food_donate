const Donation = require('../models/Donation');
const Notification = require('../models/Notification');
const { uploadToCloudinary } = require('../utils/cloudinary');
const { geocodeAddress } = require('../utils/geocoding');

// @desc    Create a new donation
// @route   POST /api/donations
// @access  Private
exports.createDonation = async (req, res) => {
  try {
    const donationData = {
      ...req.body,
      donor: req.user._id
    };

    // Handle image uploads
    if (req.files && req.files.length > 0) {
      const imageUrls = [];
      for (const file of req.files) {
        const imageUrl = await uploadToCloudinary(file.buffer, 'food-donations');
        imageUrls.push(imageUrl);
      }
      donationData.images = imageUrls;
    }

    // Initialize pickupLocation if not exists
    if (!donationData.pickupLocation) {
      donationData.pickupLocation = {};
    }

    // Set pickup location coordinates
    const lat = parseFloat(req.body.latitude);
    const lng = parseFloat(req.body.longitude);

    // Priority 1: Use provided coordinates if valid
    if (!isNaN(lat) && !isNaN(lng) && lat !== 0 && lng !== 0) {
      donationData.pickupLocation.coordinates = {
        type: 'Point',
        coordinates: [lng, lat]
      };
    }
    // Priority 2: Try to geocode the address if coordinates not provided
    else if (donationData.pickupLocation && donationData.pickupLocation.address) {
      try {
        const geocodeResult = await geocodeAddress(donationData.pickupLocation.address);
        donationData.pickupLocation.coordinates = {
          type: 'Point',
          coordinates: [geocodeResult.longitude, geocodeResult.latitude]
        };
        console.log(`✓ Geocoded address: ${geocodeResult.formattedAddress}`);
      } catch (geocodeError) {
        console.warn('Geocoding failed, using default coordinates:', geocodeError.message);
        // Set default coordinates if geocoding fails
        donationData.pickupLocation.coordinates = {
          type: 'Point',
          coordinates: [0, 0]
        };
      }
    }
    // Priority 3: Default coordinates as fallback
    else {
      donationData.pickupLocation.coordinates = {
        type: 'Point',
        coordinates: [0, 0]
      };
    }

    const donation = await Donation.create(donationData);

    // Emit socket event for new donation
    if (req.io) {
      req.io.emit('new_donation', {
        donation: await donation.populate('donor', 'name organizationType')
      });
    }

    res.status(201).json({
      success: true,
      message: 'Donation created successfully',
      data: donation
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get all donations with filters
// @route   GET /api/donations
// @access  Public
exports.getDonations = async (req, res) => {
  try {
    const {
      status,
      foodType,
      category,
      latitude,
      longitude,
      distance = 10000, // 10km default
      page = 1,
      limit = 10,
      sortBy = '-createdAt'
    } = req.query;

    // Build query
    const query = {};

    if (status) {
      query.status = status;
    } else {
      query.status = 'available';
    }

    if (foodType) {
      query.foodType = foodType;
    }

    if (category) {
      query.category = category;
    }

    // Location-based search
    const isLocationSearch = latitude && longitude;
    if (isLocationSearch) {
      const userLat = parseFloat(latitude);
      const userLng = parseFloat(longitude);
      const maxDistance = parseInt(distance);

      // Validate coordinates
      if (isNaN(userLat) || isNaN(userLng)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid latitude or longitude provided'
        });
      }

      console.log(`🔍 Location search: [${userLng}, ${userLat}] within ${maxDistance}m`);

      query['pickupLocation.coordinates.coordinates'] = {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [userLng, userLat]
          },
          $maxDistance: maxDistance
        }
      };
    }

    // Execute query with pagination
    // Note: Cannot use .sort() with $near as it automatically sorts by distance
    let queryBuilder = Donation.find(query)
      .populate('donor', 'name organizationType phone avatar rating')
      .populate('claimedBy', 'name phone');

    // Only apply sort if not using geospatial query
    if (!isLocationSearch) {
      queryBuilder = queryBuilder.sort(sortBy);
    }

    const donations = await queryBuilder
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit));

    console.log(`✓ Found ${donations.length} donations matching query`);

    // Get total count
    // Note: countDocuments doesn't work with $near, so use find().length for geospatial queries
    let total;
    if (isLocationSearch) {
      // For location-based queries, count without pagination
      const allDonations = await Donation.find(query).select('_id');
      total = allDonations.length;
    } else {
      total = await Donation.countDocuments(query);
    }

    res.json({
      success: true,
      count: donations.length,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / parseInt(limit)),
      data: donations
    });
  } catch (error) {
    console.error('❌ Error in getDonations:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to load donations'
    });
  }
};

// @desc    Get single donation
// @route   GET /api/donations/:id
// @access  Public
exports.getDonation = async (req, res) => {
  try {
    const donation = await Donation.findById(req.params.id)
      .populate('donor', 'name email phone organizationType organizationName avatar rating totalDonations')
      .populate('claimedBy', 'name email phone organizationType');

    if (!donation) {
      return res.status(404).json({
        success: false,
        message: 'Donation not found'
      });
    }

    // Increment views
    donation.views += 1;
    await donation.save();

    res.json({
      success: true,
      data: donation
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Update donation
// @route   PUT /api/donations/:id
// @access  Private
exports.updateDonation = async (req, res) => {
  try {
    let donation = await Donation.findById(req.params.id);

    if (!donation) {
      return res.status(404).json({
        success: false,
        message: 'Donation not found'
      });
    }

    // Check ownership
    if (donation.donor.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this donation'
      });
    }

    // Don't allow updating if already claimed or completed
    if (['claimed', 'completed'].includes(donation.status)) {
      return res.status(400).json({
        success: false,
        message: 'Cannot update donation that is already claimed or completed'
      });
    }

    // Handle new image uploads
    if (req.files && req.files.length > 0) {
      const imageUrls = [];
      for (const file of req.files) {
        const imageUrl = await uploadToCloudinary(file.buffer, 'food-donations');
        imageUrls.push(imageUrl);
      }
      req.body.images = [...(donation.images || []), ...imageUrls];
    }

    donation = await Donation.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.json({
      success: true,
      message: 'Donation updated successfully',
      data: donation
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Delete donation
// @route   DELETE /api/donations/:id
// @access  Private
exports.deleteDonation = async (req, res) => {
  try {
    const donation = await Donation.findById(req.params.id);

    if (!donation) {
      return res.status(404).json({
        success: false,
        message: 'Donation not found'
      });
    }

    // Check ownership
    if (donation.donor.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this donation'
      });
    }

    await donation.deleteOne();

    res.json({
      success: true,
      message: 'Donation deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Claim donation
// @route   POST /api/donations/:id/claim
// @access  Private
exports.claimDonation = async (req, res) => {
  try {
    const donation = await Donation.findById(req.params.id);

    if (!donation) {
      return res.status(404).json({
        success: false,
        message: 'Donation not found'
      });
    }

    if (donation.status !== 'available') {
      return res.status(400).json({
        success: false,
        message: 'Donation is not available'
      });
    }

    if (donation.donor.toString() === req.user._id.toString()) {
      return res.status(400).json({
        success: false,
        message: 'Cannot claim your own donation'
      });
    }

    donation.status = 'claimed';
    donation.claimedBy = req.user._id;
    donation.claimedAt = Date.now();
    await donation.save();

    // Create notification for donor
    await Notification.create({
      recipient: donation.donor,
      sender: req.user._id,
      type: 'donation_claimed',
      title: 'Donation Claimed',
      message: `${req.user.name} has claimed your donation: ${donation.title}`,
      relatedDonation: donation._id,
      priority: 'high'
    });

    // Emit socket event
    if (req.io) {
      req.io.to(donation.donor.toString()).emit('donation_claimed', {
        donation,
        claimedBy: req.user
      });
    }

    res.json({
      success: true,
      message: 'Donation claimed successfully',
      data: donation
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Complete donation
// @route   POST /api/donations/:id/complete
// @access  Private
exports.completeDonation = async (req, res) => {
  try {
    const donation = await Donation.findById(req.params.id);

    if (!donation) {
      return res.status(404).json({
        success: false,
        message: 'Donation not found'
      });
    }

    // Only donor can mark as completed
    if (donation.donor.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Only donor can mark donation as completed'
      });
    }

    if (donation.status !== 'claimed') {
      return res.status(400).json({
        success: false,
        message: 'Donation must be claimed before completion'
      });
    }

    donation.status = 'completed';
    donation.completedAt = Date.now();
    await donation.save();

    // Update user stats
    const User = require('../models/User');
    await User.findByIdAndUpdate(donation.donor, { $inc: { totalDonations: 1 } });
    await User.findByIdAndUpdate(donation.claimedBy, { $inc: { totalReceived: 1 } });

    // Create notification
    await Notification.create({
      recipient: donation.claimedBy,
      sender: req.user._id,
      type: 'donation_completed',
      title: 'Donation Completed',
      message: `Donation "${donation.title}" has been marked as completed`,
      relatedDonation: donation._id
    });

    res.json({
      success: true,
      message: 'Donation completed successfully',
      data: donation
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Cancel donation
// @route   POST /api/donations/:id/cancel
// @access  Private
exports.cancelDonation = async (req, res) => {
  try {
    const donation = await Donation.findById(req.params.id);

    if (!donation) {
      return res.status(404).json({
        success: false,
        message: 'Donation not found'
      });
    }

    // Check ownership
    if (donation.donor.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to cancel this donation'
      });
    }

    donation.status = 'cancelled';
    await donation.save();

    // Notify claimer if donation was claimed
    if (donation.claimedBy) {
      await Notification.create({
        recipient: donation.claimedBy,
        sender: req.user._id,
        type: 'donation_cancelled',
        title: 'Donation Cancelled',
        message: `Donation "${donation.title}" has been cancelled by the donor`,
        relatedDonation: donation._id,
        priority: 'high'
      });
    }

    res.json({
      success: true,
      message: 'Donation cancelled successfully',
      data: donation
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
