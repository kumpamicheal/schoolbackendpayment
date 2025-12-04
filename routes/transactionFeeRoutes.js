const express = require("express");
const router = express.Router();
const Student = require("../models/Student");
const GeneralFee = require("../models/GeneralFee");
const SpecialFee = require("../models/SpecialFee");
const authMiddleware = require("../middleware/authMiddleware");

// GET A STUDENT'S FEE
router.get("/student-amount/:id", authMiddleware, async (req, res) => {
    try {
        // Find the student
        const student = await Student.findOne({
            _id: req.params.id,
            schoolId: req.user.schoolId
        });

        if (!student) {
            return res.status(404).json({ message: "Student not found" });
        }

        // Check for special fee first (priority)
        const special = await SpecialFee.findOne({
            studentId: student._id.toString(), // ensure type match if stored as string
            schoolId: req.user.schoolId
        });

        if (special) {
            return res.json({ amount: special.amount });
        }

        // Fallback to general fee for the student's class
        const general = await GeneralFee.findOne({
            class: student.classLevel, // match field to your schema ('class')
            schoolId: req.user.schoolId
        });

        if (general) {
            return res.json({ amount: general.amount });
        }

        // If neither exists, return 0
        res.json({ amount: 0 });

    } catch (error) {
        console.error("Error fetching fee:", error);
        res.status(500).json({ message: "Server error" });
    }
});

module.exports = router;
