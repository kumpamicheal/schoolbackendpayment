const Student = require("../models/Student");
const { generatePaymentCode } = require("../utils/generateCode");

// CREATE STUDENT
exports.createStudent = async (req, res) => {
    try {
        const { name, classLevel, stream, parentPhone } = req.body;

        // Optional: validate input
        if (!name || !classLevel || !stream || !parentPhone) {
            return res.status(400).json({ message: "All fields are required" });
        }

        // Check if parentPhone is already registered
        const existingParent = await Student.findOne({ parentPhone });
        if (existingParent) {
            return res.status(400).json({ message: "This parent phone is already registered" });
        }

        // Generate unique payment code
        let paymentCode;
        let exists = true;

        while (exists) {
            paymentCode = generatePaymentCode();
            exists = await Student.findOne({ paymentCode });
        }

        const student = await Student.create({
            name,
            classLevel,
            stream,
            parentPhone,
            paymentCode
        });

        res.status(201).json(student);

    } catch (err) {
        console.error("Error creating student:", err.message);
        res.status(500).json({ message: "Server error: " + err.message });
    }
};
