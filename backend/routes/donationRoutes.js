const express = require('express');
const router = express.Router();
const {
  createDonation,
  getDonations,
  getDonation,
  updateDonation,
  deleteDonation,
  claimDonation,
  completeDonation,
  cancelDonation
} = require('../controllers/donationController');
const { protect, optionalAuth, authorize } = require('../middleware/auth');
const {
  createDonationValidation,
  updateDonationValidation,
  idValidation,
  paginationValidation,
  locationValidation,
  validate
} = require('../middleware/validation');
const upload = require('../middleware/upload');

// Public routes
router.get(
  '/',
  optionalAuth,
  paginationValidation,
  locationValidation,
  validate,
  getDonations
);

router.get(
  '/:id',
  idValidation,
  validate,
  getDonation
);

// Protected routes - Donor only
router.post(
  '/',
  protect,
  authorize('donor', 'admin'),
  upload.array('images', 5),
  createDonationValidation,
  validate,
  createDonation
);

router.put(
  '/:id',
  protect,
  upload.array('images', 5),
  idValidation,
  updateDonationValidation,
  validate,
  updateDonation
);

router.delete(
  '/:id',
  protect,
  idValidation,
  validate,
  deleteDonation
);

// Receiver only - Claim donation
router.post(
  '/:id/claim',
  protect,
  authorize('receiver', 'admin'),
  idValidation,
  validate,
  claimDonation
);

router.post(
  '/:id/complete',
  protect,
  idValidation,
  validate,
  completeDonation
);

router.post(
  '/:id/cancel',
  protect,
  idValidation,
  validate,
  cancelDonation
);

module.exports = router;
