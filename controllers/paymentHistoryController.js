const Payments = require("../models/Payment");

const getPaymentHistory = async (req, res) => {
    try {
        const { studentId } = req.params;

        if (!studentId) {
            return res.status(400).json({ message: "Student ID is required" });
        }

        const payments = await Payments.find({ studentId }).sort({ createdAt: -1 });

        // Attach YEAR to each payment (term removed)
        const enhancedPayments = [];

        for (let pay of payments) {
            const year = new Date(pay.createdAt).getFullYear();

            enhancedPayments.push({
                ...pay._doc,
                year
            });
        }

        res.status(200).json({ payments: enhancedPayments });

    } catch (error) {
        console.error("Payment History Error:", error);
        res.status(500).json({
            message: "Failed to fetch payment history",
            error: error.message
        });
    }
};

module.exports = { getPaymentHistory };
