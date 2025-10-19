const User = require('../models/User');
const Donation = require('../models/Donation');
const { uploadToCloudinary } = require('../utils/cloudinary');

// @desc    Get user profile
// @route   GET /api/users/profile/:id
// @access  Public
exports.getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .select('-password')
      .populate('donationsGiven', 'title status createdAt')
      .populate('donationsReceived', 'title status createdAt');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Get donation statistics
    const donationsGiven = await Donation.countDocuments({
      donor: user._id,
      status: 'completed'
    });

    const donationsReceived = await Donation.countDocuments({
      claimedBy: user._id,
      status: 'completed'
    });

    res.json({
      success: true,
      data: {
        ...user.toObject(),
        stats: {
          donationsGiven,
          donationsReceived
        }
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
exports.updateProfile = async (req, res) => {
  try {
    const allowedUpdates = [
      'name',
      'phone',
      'address',
      'organizationType',
      'organizationName'
    ];

    const updates = {};
    Object.keys(req.body).forEach(key => {
      if (allowedUpdates.includes(key)) {
        // Parse address if it's a JSON string
        if (key === 'address' && typeof req.body[key] === 'string') {
          try {
            updates[key] = JSON.parse(req.body[key]);
          } catch (e) {
            updates[key] = req.body[key];
          }
        } else {
          updates[key] = req.body[key];
        }
      }
    });

    // Handle avatar upload
    if (req.file) {
      const avatarUrl = await uploadToCloudinary(req.file.buffer, 'avatars');
      updates.avatar = avatarUrl;
    }

    // Update location if provided
    if (req.body.latitude && req.body.longitude) {
      updates.location = {
        type: 'Point',
        coordinates: [parseFloat(req.body.longitude), parseFloat(req.body.latitude)]
      };
    }

    const user = await User.findByIdAndUpdate(
      req.user._id,
      updates,
      {
        new: true,
        runValidators: true
      }
    ).select('-password');

    res.json({
      success: true,
      message: 'Profile updated successfully',
      data: user
    });
  } catch (error) {
    console.error('Profile update error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get user's donations (both given and received)
// @route   GET /api/users/donations
// @access  Private
exports.getUserDonations = async (req, res) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;

    // Include both donations given by user AND donations claimed by user
    const query = {
      $or: [
        { donor: req.user._id },
        { claimedBy: req.user._id }
      ]
    };

    if (status) {
      query.status = status;
    }

    const donations = await Donation.find(query)
      .populate('donor', 'name phone organizationType')
      .populate('claimedBy', 'name phone organizationType')
      .sort('-createdAt')
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit));

    const total = await Donation.countDocuments(query);

    res.json({
      success: true,
      count: donations.length,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / parseInt(limit)),
      data: donations
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get user's claimed donations
// @route   GET /api/users/claimed-donations
// @access  Private
exports.getClaimedDonations = async (req, res) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;

    const query = { claimedBy: req.user._id };
    if (status) {
      query.status = status;
    }

    const donations = await Donation.find(query)
      .populate('donor', 'name phone organizationType address')
      .sort('-claimedAt')
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit));

    const total = await Donation.countDocuments(query);

    res.json({
      success: true,
      count: donations.length,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / parseInt(limit)),
      data: donations
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get all users (admin only)
// @route   GET /api/users
// @access  Private/Admin
exports.getAllUsers = async (req, res) => {
  try {
    const { role, isActive, page = 1, limit = 20 } = req.query;

    const query = {};
    if (role) query.role = role;
    if (isActive !== undefined) query.isActive = isActive === 'true';

    const users = await User.find(query)
      .select('-password')
      .sort('-createdAt')
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit));

    const total = await User.countDocuments(query);

    res.json({
      success: true,
      count: users.length,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / parseInt(limit)),
      data: users
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Deactivate user account
// @route   PUT /api/users/deactivate
// @access  Private
exports.deactivateAccount = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { isActive: false },
      { new: true }
    ).select('-password');

    res.json({
      success: true,
      message: 'Account deactivated successfully',
      data: user
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get dashboard stats
// @route   GET /api/users/stats
// @access  Private
exports.getDashboardStats = async (req, res) => {
  try {
    const userId = req.user._id;

    // Get donations given
    const donationsGiven = await Donation.countDocuments({
      donor: userId
    });

    const activeDonations = await Donation.countDocuments({
      donor: userId,
      status: 'available'
    });

    const completedDonations = await Donation.countDocuments({
      donor: userId,
      status: 'completed'
    });

    // Get donations received
    const donationsReceived = await Donation.countDocuments({
      claimedBy: userId
    });

    const activeReceived = await Donation.countDocuments({
      claimedBy: userId,
      status: 'claimed'
    });

    const completedReceived = await Donation.countDocuments({
      claimedBy: userId,
      status: 'completed'
    });

    // Get recent activity
    const recentDonations = await Donation.find({
      $or: [{ donor: userId }, { claimedBy: userId }]
    })
      .sort('-updatedAt')
      .limit(5)
      .populate('donor', 'name')
      .populate('claimedBy', 'name');

    res.json({
      success: true,
      data: {
        totalDonations: donationsGiven,
        activeDonations: activeDonations,
        completedDonations: completedDonations,
        donationsReceived: donationsReceived,
        donationsGiven: {
          total: donationsGiven,
          active: activeDonations,
          completed: completedDonations
        },
        donationsReceivedDetails: {
          total: donationsReceived,
          active: activeReceived,
          completed: completedReceived
        },
        recentActivity: recentDonations
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
