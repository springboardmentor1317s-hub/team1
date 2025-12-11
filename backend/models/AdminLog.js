const mongoose = require("mongoose");

const AdminLogSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // Admin
  registration_id: { type: mongoose.Schema.Types.ObjectId, ref: "Registration" },
  action: String,
  timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model("AdminLog", AdminLogSchema);
