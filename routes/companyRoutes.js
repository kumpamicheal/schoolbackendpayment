// routes/companyRoutes.js
const express = require("express");
const router = express.Router();
const { getAllSchools, getSchoolDetails } = require("../controllers/companyController");

// ROUTE: GET all registered schools
router.get("/all-schools", getAllSchools);

// ROUTE: GET single school details (optional)
router.get("/school/:id", getSchoolDetails);

module.exports = router;
