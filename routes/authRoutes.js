const express = require("express");
const router = express.Router();

const { loginSchool } = require("../controllers/authController");

router.post("/login", loginSchool);

module.exports = router;
