const School = require("../models/School");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const loginSchool = async (req, res) => {
    try {
        const { email, password } = req.body;

        // 1. Check if school exists
        const school = await School.findOne({ email });
        if (!school) {
            return res.status(400).json({ message: "School not found" });
        }

        // 2. Compare passwords
        const isMatch = await bcrypt.compare(password, school.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid password" });
        }

        // 3. Create JWT token
        const token = jwt.sign(
            { id: school._id },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        );

        res.json({
            message: "Login successful",
            token,
            school: {
                id: school._id,
                name: school.name,
                email: school.email,
            }
        });

    } catch (error) {
        console.error("Login Error:", error);
        res.status(500).json({ message: "Server Error" });
    }
};

module.exports = { loginSchool };
