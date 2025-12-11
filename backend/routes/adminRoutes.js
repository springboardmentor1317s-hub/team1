const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const authorizeRoles = require("../middleware/roles");
const { getAdminDashboardStats } = require("../controllers/adminController");

router.get(
  "/dashboard",
  auth,
  authorizeRoles("college_admin", "super_admin"),
  getAdminDashboardStats
);

module.exports = router;
