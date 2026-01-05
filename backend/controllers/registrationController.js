const Registration = require("../models/Registration");
const AdminLog = require("../models/AdminLog");

exports.getMyRegistrations = async (req, res, next) => {
  try {
    const regs = await Registration.find({ user_id: req.user._id })
      .populate("event_id")
      .sort({ timestamp: -1 });

    res.json(regs);
  } catch (err) {
    next(err);
  }
};

exports.registerForEvent = async (req, res, next) => {
  try {
    const { event_id } = req.body;
    const existing = await Registration.findOne({
      event_id,
      user_id: req.user._id
    });

    if (existing) {
      return res
        .status(400)
        .json({ message: "Already registered for this event" });
    }

    const reg = await Registration.create({
      event_id,
      user_id: req.user._id
    });

    res.status(201).json(reg);
  } catch (err) {
    next(err);
  }
};

exports.getEventRegistrations = async (req, res, next) => {
  try {
    const regs = await Registration.find({ event_id: req.params.eventId })
      .populate("user_id", "name email college")
      .sort({ timestamp: -1 });

    res.json(regs);
  } catch (err) {
    next(err);
  }
};

exports.updateRegistrationStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const registration = await Registration.findById(id)
      .populate("user_id")
      .populate("event_id");

    if (!registration) {
      return res.status(404).json({ message: "Registration not found" });
    }

    registration.status = status;
    await registration.save();

    await AdminLog.create({
      user_id: req.user._id, // Admin who performed action
      registration_id: registration._id, // Connect Log → Registration
      action: `Changed registration to ${status}`
    });

    res.json({ message: "Status updated", registration });
  } catch (err) {
    next(err);
  }
};