const express = require('express');
const router = express.Router();
const {
  createRequest,
  getRequests,
  getRequest,
  acceptRequest,
  rejectRequest,
  cancelRequest
} = require('../controllers/requestController');
const { protect } = require('../middleware/auth');
const {
  createRequestValidation,
  idValidation,
  validate
} = require('../middleware/validation');

// All routes are protected
router.use(protect);

router.post('/', createRequestValidation, validate, createRequest);
router.get('/', getRequests);
router.get('/:id', idValidation, validate, getRequest);
router.put('/:id/accept', idValidation, validate, acceptRequest);
router.put('/:id/reject', idValidation, validate, rejectRequest);
router.put('/:id/cancel', idValidation, validate, cancelRequest);

module.exports = router;
