const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const authorizeRoles = require("../middleware/roles");
const {
  registerForEvent,
  getMyRegistrations,
  getEventRegistrations,
  updateRegistrationStatus
} = require("../controllers/registrationController");

// route passed for student
router.post("/", auth, registerForEvent);
router.get("/my", auth, getMyRegistrations);

// route passed for admin
router.get(
  "/event/:eventId",
  auth,
  authorizeRoles("college_admin", "super_admin"),
  getEventRegistrations
);

router.patch(
  "/:id/status",
  auth,
  authorizeRoles("college_admin", "super_admin"),
  updateRegistrationStatus
);

module.exports = router;
