// controllers/companyController.js
const School = require("../models/School");

// GET ALL REGISTERED SCHOOLS FOR COMPANY DASHBOARD
const getAllSchools = async (req, res) => {
    try {
        const schools = await School.find().sort({ createdAt: -1 }); // newest first
        res.status(200).json(schools);
    } catch (error) {
        console.error("Error fetching schools:", error);
        res.status(500).json({ message: "Server error while fetching schools" });
    }
};

// GET SINGLE SCHOOL DETAILS (optional)
const getSchoolDetails = async (req, res) => {
    try {
        const school = await School.findById(req.params.id);
        if (!school) return res.status(404).json({ message: "School not found" });

        res.status(200).json(school);
    } catch (error) {
        res.status(500).json({ message: "Server error finding school" });
    }
};

module.exports = { getAllSchools, getSchoolDetails };
