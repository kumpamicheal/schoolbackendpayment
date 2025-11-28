const express = require("express");
const Student = require("../models/Student");
const router = express.Router();

// PARENT LOGIN
router.post("/login", async (req, res) => {
    const { phone, paymentCode } = req.body;

    try {
        const student = await Student.findOne({
            parentPhone: phone,
            paymentCode: paymentCode
        });

        if (!student) {
            return res.status(404).json({ message: "Invalid phone or payment code" });
        }

        res.json({
            message: "Login successful",
            student
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
