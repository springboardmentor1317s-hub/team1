const express = require('express');
const router = express.Router();
const notificationController = require('../controllers/notificationController');
const { protect } = require('../middleware/authMiddleware');

// 🔐 Protect all notification routes
router.use(protect);

// ===============================
// 📩 Get all notifications (student)
// GET /api/notifications
// ===============================
router.get(
  '/',
  notificationController.getUserNotifications
);

// ===============================
// 🔢 Get unread notification count
// GET /api/notifications/unread/count
// ===============================
router.get(
  '/unread/count',
  notificationController.getUnreadCount
);

// ===============================
// ✅ Mark notification as read
// POST /api/notifications/:notificationId/read
// ===============================
router.post(
  '/:notificationId/read',
  notificationController.markNotificationAsRead
);

// ===============================
// 🗑 Delete single notification
// DELETE /api/notifications/:notificationId
// ===============================
router.delete(
  '/:notificationId',
  notificationController.deleteNotification
);

// ===============================
// 🧹 Delete ALL notifications of user
// DELETE /api/notifications
// ===============================
router.delete(
  '/',
  notificationController.deleteAllNotifications
);

module.exports = router;