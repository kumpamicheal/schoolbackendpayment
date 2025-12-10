const Payments = require("../models/Payment");
const Student = require("../models/Student");
const GeneralFee = require("../models/GeneralFee");
const SpecialFee = require("../models/SpecialFee");

// MAKE PAYMENT
exports.makePayment = async (req, res) => {
    try {
        const { studentId, schoolId, amount, method } = req.body;

        if (!studentId || !schoolId || !amount) {
            return res.status(400).json({ message: "Missing required fields" });
        }

        const student = await Student.findOne({ _id: studentId, schoolId });
        if (!student) return res.status(404).json({ message: "Student not found" });

        // Create payment record (mocked as Success for now)
        const payment = await Payments.create({
            studentId,
            schoolId,
            amount,
            method,
            status: "Success",
            providerMessage: "Mock payment successful"
        });

        // Calculate fees dynamically
        let fees = student.specialCase
            ? await SpecialFee.find({ schoolId: student.schoolId, classLevel: student.classLevel })
            : await GeneralFee.find({ schoolId: student.schoolId, classLevel: student.classLevel });

        const totalFees = fees.reduce((acc, f) => acc + f.amount, 0);

        // Sum all successful payments
        const payments = await Payments.find({ studentId: student._id, status: "Success" });
        const paidAmount = payments.reduce((acc, p) => acc + p.amount, 0);
        const balance = totalFees - paidAmount;

        res.status(201).json({
            message: "Payment successful",
            payment,
            totalFees,
            paidAmount,
            balance
        });
    } catch (err) {
        console.error("MAKE PAYMENT ERROR:", err);
        res.status(500).json({ message: "Server error", error: err.message });
    }
};
