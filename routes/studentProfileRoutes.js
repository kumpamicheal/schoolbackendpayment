const express = require("express");
const router = express.Router();

const { getStudentProfile } = require("../controllers/studentProfileController");

// Public route - fetch student profile
router.get("/:studentId", getStudentProfile);

module.exports = router;
