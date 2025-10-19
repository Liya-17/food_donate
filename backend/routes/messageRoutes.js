const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const {
  getConversations,
  getMessages,
  getUnreadCount,
  markAsRead
} = require('../controllers/messageController');

// All routes require authentication
router.use(protect);

// Get all conversations for logged in user
router.get('/conversations', getConversations);

// Get total unread count
router.get('/unread/count', getUnreadCount);

// Get messages for a specific donation
router.get('/:donationId', getMessages);

// Mark messages as read
router.put('/:donationId/read', markAsRead);

module.exports = router;
