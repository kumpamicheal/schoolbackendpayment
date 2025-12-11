const express = require("express");
const router = express.Router();
const { getStudentProfile } = require("../controllers/studentProfileController");

router.get("/:id", getStudentProfile);

module.exports = router;
