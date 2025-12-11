const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const authorizeRoles = require("../middleware/roles");
const {
  createEvent,
  getEvents,
  getEventById,
  updateEvent,
  deleteEvent,
  getMyEvents
} = require("../controllers/eventController");

router.get("/", getEvents);
router.get(
  "/mine",
  auth,
  authorizeRoles("college_admin", "super_admin"),
  getMyEvents
);

router.get("/:id", getEventById);
router.post("/", auth, authorizeRoles("college_admin", "super_admin"), createEvent);
router.put("/:id", auth, authorizeRoles("college_admin", "super_admin"), updateEvent);
router.delete("/:id", auth, authorizeRoles("college_admin", "super_admin"), deleteEvent);

module.exports = router;
