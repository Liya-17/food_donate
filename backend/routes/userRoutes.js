const express = require('express');
const router = express.Router();
const {
  getUserProfile,
  updateProfile,
  getUserDonations,
  getClaimedDonations,
  getAllUsers,
  deactivateAccount,
  getDashboardStats
} = require('../controllers/userController');
const { protect, authorize } = require('../middleware/auth');
const { idValidation, validate } = require('../middleware/validation');
const upload = require('../middleware/upload');

// Public routes
router.get('/profile/:id', idValidation, validate, getUserProfile);

// Protected routes
router.get('/donations', protect, getUserDonations);
router.get('/claimed-donations', protect, getClaimedDonations);
router.get('/stats', protect, getDashboardStats);
router.put('/profile', protect, upload.single('avatar'), updateProfile);
router.put('/deactivate', protect, deactivateAccount);

// Admin only routes
router.get('/', protect, authorize('admin'), getAllUsers);

module.exports = router;
