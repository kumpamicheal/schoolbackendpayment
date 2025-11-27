const School = require("../models/School");
const bcrypt = require("bcrypt");

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

        // 1. Check if email already exists
        const existingSchool = await School.findOne({ email });
        if (existingSchool) {
            return res.status(400).json({ message: "Email already registered" });
        }

        // 2. Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // 3. Create school
        const school = await School.create({
            name,
            headTeacher,
            location,
            email,
            phone,
            subscription,
            paymentMethod,
            studentsCount,
            password: hashedPassword,  // <== save hashed password
            status: "Active",
        });

        res.status(201).json({
            message: "School account created successfully",
            school
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server Error" });
    }
};

module.exports = { createSchool };
