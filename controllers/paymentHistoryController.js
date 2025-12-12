const Payments = require("../models/Payment");
const GeneralFee = require("../models/GeneralFee");
const SpecialFee = require("../models/SpecialFee");

const getPaymentHistory = async (req, res) => {
    try {
        const { studentId } = req.params;

        if (!studentId) {
            return res.status(400).json({ message: "Student ID is required" });
        }

        const payments = await Payments.find({ studentId }).sort({ createdAt: -1 });

        // Attach TERM + YEAR to each payment
        const enhancedPayments = [];

        for (let pay of payments) {
            let term = "Unknown";

            // Debug log for safe checking
            console.log("Processing payment:", pay._id, pay.studentName, pay.classLevel, pay.schoolId);

            // Step 1: Try special fee first (match name safely)
            const special = await SpecialFee.findOne({
                student: new RegExp(`^${(pay.studentName || "").trim()}$`, "i"), // safe guard added
                class: pay.classLevel
            });

            if (special) {
                term = special.term;
            } else {
                // Step 2: fallback to general fee
                const general = await GeneralFee.findOne({
                    schoolId: pay.schoolId,
                    class: pay.classLevel
                });
                if (general) term = general.term;
            }

            const year = new Date(pay.createdAt).getFullYear();

            enhancedPayments.push({
                ...pay._doc,
                term,
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
