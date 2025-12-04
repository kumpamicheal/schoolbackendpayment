const express = require("express");
const router = express.Router();
const School = require("../models/School");
const authMiddleware = require("../middleware/authMiddleware");

// GET LOGGED-IN SCHOOL DETAILS
router.get("/me", authMiddleware, async (req, res) => {
    try {
        const school = await School.findById(req.user.schoolId);
        if (!school) return res.status(404).json({ message: "School not found" });

        res.status(200).json(school);
    } catch (error) {
        console.error("Error fetching school details:", error);
        res.status(500).json({ message: "Server error while fetching school details" });
    }
});

module.exports = router;
