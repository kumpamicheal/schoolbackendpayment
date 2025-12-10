// routes/studentProfileRoutes.js
const express = require("express");
const router = express.Router();

// Import profile controller
const { getStudentProfile } = require("../controllers/studentProfileController");
const { protect } = require("../middleware/authMiddleware");

// Student profile route
router.get("/:studentId", protect, getStudentProfile);

module.exports = router;
