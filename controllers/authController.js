// controllers/authController.js
const School = require("../models/School");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const loginSchool = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) return res.status(400).json({ message: "Email and password are required" });

        const school = await School.findOne({ email });
        if (!school) return res.status(400).json({ message: "School not found" });

        const isMatch = await bcrypt.compare(password, school.password);
        if (!isMatch) return res.status(400).json({ message: "Invalid password" });

        // Sign token with schoolId to be explicit
        const token = jwt.sign(
            { schoolId: school._id, email: school.email },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        );

        res.json({
            message: "Login successful",
            token,
            school: { id: school._id, name: school.name, email: school.email }
        });
    } catch (error) {
        console.error("Login Error:", error);
        res.status(500).json({ message: "Server Error" });
    }
};

module.exports = { loginSchool };
