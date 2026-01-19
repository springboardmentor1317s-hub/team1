const Feedback = require("../models/Feedback");

exports.getEventFeedback = async (req, res, next) => {
  try {
    const feedback = await Feedback.find({ event_id: req.params.eventId })
      .populate("user_id", "name college")
      .sort({ timestamp: -1 });

    res.json(feedback);
  } catch (err) {
    next(err);
  }
};

exports.addFeedback = async (req, res, next) => {
  try {
    const { event_id, rating, comments } = req.body;

    const fb = await Feedback.create({
      event_id,
      user_id: req.user._id,
      rating,
      comments
    });

    res.status(201).json(fb);
  } catch (err) {
    next(err);
  }
};
