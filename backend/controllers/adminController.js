const AdminLog = require("../models/AdminLog");
const Event = require("../models/Event");
const Registration = require("../models/Registration");
const Feedback = require("../models/Feedback");

exports.getAdminDashboardStats = async (req, res, next) => {
  try {
    const totalEvents = await Event.countDocuments({ college_id: req.user._id });
    const totalRegistrations = await Registration.countDocuments();
    const totalFeedback = await Feedback.countDocuments();

    const recentLogs = await AdminLog.find()
      .sort({ timestamp: -1 })
      .limit(10)
      .populate("user_id", "name email") // Admin who performed the action
      .populate({
        path: "registration_id",
        populate: [
          { path: "user_id", select: "name" }, // Student Name
          { path: "event_id", select: "title" } // Event Title
        ]
      });

    res.json({
      totalEvents,
      totalRegistrations,
      totalFeedback,
      recentLogs
    });
  } catch (err) {
    next(err);
  }
};
