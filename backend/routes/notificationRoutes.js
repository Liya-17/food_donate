const express = require('express');
const router = express.Router();
const {
  getNotifications,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  clearReadNotifications,
  getUnreadCount
} = require('../controllers/notificationController');
const { protect } = require('../middleware/auth');
const { idValidation, validate } = require('../middleware/validation');

// All routes are protected
router.use(protect);

router.get('/', getNotifications);
router.get('/unread-count', getUnreadCount);
router.put('/read-all', markAllAsRead);
router.delete('/clear-read', clearReadNotifications);
router.put('/:id/read', idValidation, validate, markAsRead);
router.delete('/:id', idValidation, validate, deleteNotification);

module.exports = router;
