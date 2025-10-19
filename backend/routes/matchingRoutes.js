const express = require('express');
const router = express.Router();
const {
  getSmartMatches,
  getMatchScore,
  updatePreferences,
  getPreferences,
  notifyMatchingReceivers,
  getMatchingStats
} = require('../controllers/matchingController');
const { protect, authorize } = require('../middleware/auth');

// All routes require authentication
router.use(protect);

// Get smart matches for current user (receivers only)
router.get('/smart-matches', authorize('receiver'), getSmartMatches);

// Get match score for specific donation
router.get('/score/:donationId', authorize('receiver'), getMatchScore);

// Get/Update user preferences
router.route('/preferences')
  .get(getPreferences)
  .put(updatePreferences);

// Notify matching receivers about new donation (donors only)
router.post('/notify/:donationId', authorize('donor'), notifyMatchingReceivers);

// Get matching statistics
router.get('/stats', getMatchingStats);

module.exports = router;
