// controllers/schoolController.js
const School = require("../models/School");

// Create new school account
const createSchool = async (req, res) => {
    try {
        const {
            name,
            headTeacher,
            location,
            email,
            phone,
            subscription,
            paymentMethod,
            studentsCount,
            password
        } = req.body;

        // Validate minimal fields
        if (!name || !headTeacher || !email || !password) {
            return res.status(400).json({ message: "Missing required fields" });
        }

        // 1. Check if email already exists
        const existingSchool = await School.findOne({ email });
        if (existingSchool) {
            return res.status(400).json({ message: "Email already registered" });
        }

        // 2. Create school (DO NOT HASH PASSWORD HERE)
        // The School model pre-save hook will hash the password once
        const school = await School.create({
            name,
            headTeacher,
            location,
            email,
            phone,
            subscription: subscription || "active",
            paymentMethod: paymentMethod || "none",
            studentsCount: studentsCount || 0,
            password, // <-- plain password, schema will hash
            status: "Active",
        });

        res.status(201).json({
            message: "School account created successfully",
            school
        });
    } catch (error) {
        console.error("Create School Error:", error);
        res.status(500).json({ message: "Server Error" });
    }
};

module.exports = { createSchool };
