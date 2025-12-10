const Payments = require("../models/Payment");

// ---------------------------------------------
// GET PAYMENT HISTORY CONTROLLER
// ---------------------------------------------
const getPaymentHistory = async (req, res) => {
    try {
        const { studentId } = req.params;

        if (!studentId) {
            return res.status(400).json({ message: "Student ID is required" });
        }

        const payments = await Payments.find({ studentId }).sort({ createdAt: -1 });

        res.status(200).json({ payments });
    } catch (error) {
        console.error("Payment History Error:", error);
        res.status(500).json({ message: "Failed to fetch payment history", error: error.message });
    }
};

module.exports = { getPaymentHistory };
