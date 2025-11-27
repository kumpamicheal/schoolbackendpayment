const express = require("express");
const router = express.Router();

const { createSchool } = require("../controllers/schoolController");

// CREATE SCHOOL (POST /api/schools)
router.post("/", createSchool);

module.exports = router;
