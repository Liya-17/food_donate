const SmartMatchingService = require('../services/smartMatchingService');
const User = require('../models/User');
const Notification = require('../models/Notification');

// @desc    Get smart matches for current user (receiver)
// @route   GET /api/matching/smart-matches
// @access  Private (Receiver only)
exports.getSmartMatches = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;

    const matches = await SmartMatchingService.getSmartMatches(req.user._id, limit);

    res.json({
      success: true,
      count: matches.length,
      data: matches
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get match score for a specific donation
// @route   GET /api/matching/score/:donationId
// @access  Private (Receiver only)
exports.getMatchScore = async (req, res) => {
  try {
    const Donation = require('../models/Donation');

    const donation = await Donation.findById(req.params.donationId)
      .populate('donor', 'name organizationType rating avatar');

    if (!donation) {
      return res.status(404).json({
        success: false,
        message: 'Donation not found'
      });
    }

    const user = await User.findById(req.user._id);

    const matchResult = SmartMatchingService.calculateMatchScore(
      donation.toObject(),
      user.toObject()
    );

    res.json({
      success: true,
      data: {
        donation: donation,
        matchScore: matchResult.score,
        matchPercentage: matchResult.percentage,
        breakdown: matchResult.breakdown,
        recommendationLevel: matchResult.recommendationLevel
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Update user matching preferences
// @route   PUT /api/matching/preferences
// @access  Private
exports.updatePreferences = async (req, res) => {
  try {
    const {
      dietaryPreferences,
      preferredCategories,
      maxDistance,
      preferredPickupTimes,
      minServings,
      maxServings,
      notifyOnMatch,
      autoMatchEnabled
    } = req.body;

    const user = await User.findById(req.user._id);

    // Update preferences
    if (dietaryPreferences !== undefined) {
      user.preferences.dietaryPreferences = dietaryPreferences;
    }
    if (preferredCategories !== undefined) {
      user.preferences.preferredCategories = preferredCategories;
    }
    if (maxDistance !== undefined) {
      user.preferences.maxDistance = maxDistance;
    }
    if (preferredPickupTimes !== undefined) {
      user.preferences.preferredPickupTimes = preferredPickupTimes;
    }
    if (minServings !== undefined) {
      user.preferences.minServings = minServings;
    }
    if (maxServings !== undefined) {
      user.preferences.maxServings = maxServings;
    }
    if (notifyOnMatch !== undefined) {
      user.preferences.notifyOnMatch = notifyOnMatch;
    }
    if (autoMatchEnabled !== undefined) {
      user.preferences.autoMatchEnabled = autoMatchEnabled;
    }

    await user.save();

    res.json({
      success: true,
      message: 'Preferences updated successfully',
      data: user.preferences
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get user's matching preferences
// @route   GET /api/matching/preferences
// @access  Private
exports.getPreferences = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    res.json({
      success: true,
      data: user.preferences || {}
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Notify matching receivers about a new donation
// @route   POST /api/matching/notify/:donationId
// @access  Private (Donor only)
exports.notifyMatchingReceivers = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 20;

    const matches = await SmartMatchingService.getMatchingReceivers(
      req.params.donationId,
      limit
    );

    // Create notifications for top matches
    const notifications = await Promise.all(
      matches.map(async (match) => {
        if (match.receiver.preferences?.notifyOnMatch) {
          return await Notification.create({
            user: match.receiver._id,
            type: 'smart_match',
            title: '🎯 Smart Match Found!',
            message: `${match.matchPercentage}% match for "${match.donation?.title}". ${match.recommendationLevel === 'perfect' ? 'Perfect for you!' : 'Great opportunity!'}`,
            relatedDonation: req.params.donationId,
            priority: match.matchPercentage >= 80 ? 'high' : 'medium',
            metadata: {
              matchPercentage: match.matchPercentage,
              recommendationLevel: match.recommendationLevel
            }
          });
        }
      })
    );

    // Emit socket events for real-time notifications
    if (req.io) {
      matches.forEach(match => {
        if (match.receiver.preferences?.notifyOnMatch) {
          req.io.to(match.receiver._id.toString()).emit('smart_match_notification', {
            donation: match.donation,
            matchPercentage: match.matchPercentage,
            recommendationLevel: match.recommendationLevel
          });
        }
      });
    }

    res.json({
      success: true,
      message: `Notified ${matches.length} matching receivers`,
      data: {
        totalMatches: matches.length,
        notificationsSent: notifications.filter(n => n).length
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get matching statistics for current user
// @route   GET /api/matching/stats
// @access  Private
exports.getMatchingStats = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    res.json({
      success: true,
      data: user.matchingStats || {}
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
