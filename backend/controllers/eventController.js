const Event = require("../models/Event");

exports.createEvent = async (req, res, next) => {
  try {
    // creation of different attributes for the events
    const {
      title,
      description,
      category,
      location,
      start_date,
      end_date
    } = req.body;

    const event = await Event.create({
      college_id: req.user._id,
      title,
      description,
      category,
      location,
      start_date,
      end_date
    });

    res.status(201).json(event);
  } catch (err) {
    next(err);
  }
};

exports.getEvents = async (req, res, next) => {
  try {
    const { category, college, startDate } = req.query;
    const filter = {};

    if (category) filter.category = category;
    if (college) filter.college_id = college;
    if (startDate) filter.start_date = { $gte: new Date(startDate) };

    const events = await Event.find(filter)
      .populate("college_id", "name college")
      .sort({ start_date: 1 });

    res.json(events);
  } catch (err) {
    next(err);
  }
};

exports.getEventById = async (req, res, next) => {
  try {
    const event = await Event.findById(req.params.id).populate(
      "college_id",
      "name college"
    );
    if (!event) return res.status(404).json({ message: "Event not found" });
    res.json(event);
  } catch (err) {
    next(err);
  }
};

exports.updateEvent = async (req, res, next) => {
  try {
    const event = await Event.findOneAndUpdate(
      { _id: req.params.id, college_id: req.user._id },
      req.body,
      { new: true }
    );
    if (!event) {
      return res
        .status(404)
        .json({ message: "Event not found or not owned by this admin" });
    }
    res.json(event);
  } catch (err) {
    next(err);
  }
};

exports.deleteEvent = async (req, res, next) => {
  try {
    const event = await Event.findOneAndDelete({
      _id: req.params.id,
      college_id: req.user._id
    });
    if (!event) {
      return res
        .status(404)
        .json({ message: "Event not found or not owned by this admin" });
    }
    res.json({ message: "Event deleted" });
  } catch (err) {
    next(err);
  }
};

exports.getMyEvents = async (req, res, next) => {
  try {
    const events = await Event.find({ college_id: req.user._id }).sort({
      created_at: -1
    });
    res.json(events);
  } catch (err) {
    next(err);
  }
};
