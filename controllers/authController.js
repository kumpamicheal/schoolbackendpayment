// controllers/authController.js
const jwt = require("jsonwebtoken");
const School = require("../models/School");
const bcrypt = require("bcryptjs");

exports.loginSchool = async (req, res) => {
    try {
        const { email, password } = req.body;

        const school = await School.findOne({ email });
        if (!school) {
            return res.status(404).json({ message: "School not found" });
        }

        const isMatch = await bcrypt.compare(password, school.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid password" });
        }

        // FIX: send schoolId + email
        const token = jwt.sign(
            {
                schoolId: school._id,
                email: school.email
            },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        );

        return res.json({
            message: "Login successful",
            token,
            schoolId: school._id
        });

    } catch (err) {
        console.error("Login error:", err);
        return res.status(500).json({ message: "Server error" });
    }
};
