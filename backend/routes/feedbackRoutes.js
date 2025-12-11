const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const { addFeedback, getEventFeedback } = require("../controllers/feedbackController");

router.post("/", auth, addFeedback);
router.get("/event/:eventId", getEventFeedback);

module.exports = router;
