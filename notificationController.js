const Notification = require("../models/Notification");

// Fetch notifications
exports.getUserNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({ user_id: req.user.id })
      .sort({ created_at: -1 });

    res.json({
      success: true,
      data: notifications
    });

  } catch (err) {
    res.status(500).json({ success: false, error: "Server error" });
  }
};

// Mark notification as read
exports.markNotificationAsRead = async (req, res) => {
  try {
    const updated = await Notification.markAsRead(req.params.notificationId, req.user.id);
    res.json({ success: true, data: updated });
  } catch (err) {
    res.status(500).json({ success: false, error: "Server error" });
  }
};

// Delete one
exports.deleteNotification = async (req, res) => {
  try {
    await Notification.findOneAndDelete({ _id: req.params.notificationId, user_id: req.user.id });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, error: "Server error" });
  }
};

// Delete all
exports.deleteAllNotifications = async (req, res) => {
  try {
    await Notification.deleteMany({ user_id: req.user.id });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, error: "Server error" });
  }
};

// Unread count
exports.getUnreadCount = async (req, res) => {
  try {
    const count = await Notification.getUnreadCount(req.user.id);
    res.json({ success: true, unreadCount: count });
  } catch (err) {
    res.status(500).json({ success: false, error: "Server error" });
  }
};

// Create notification (used by other routes)
exports.createNotification = async (userId, message, type, eventId = null) => {
  return await Notification.createNotification({
    user_id: userId,
    message,
    type,
    related_event: eventId
  });
};
