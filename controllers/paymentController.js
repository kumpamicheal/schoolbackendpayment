const Payments = require("../models/Payment");

// ---------------------------------------------
// PHONE NORMALIZER
// Ensures MTN Uganda format is always 2567XXXXXXX
// ---------------------------------------------
function normalizePhone(phone) {
    let cleaned = phone.trim();

    if (cleaned.startsWith("+256")) {
        cleaned = cleaned.replace("+256", "256");
    } else if (cleaned.startsWith("0")) {
        cleaned = "256" + cleaned.substring(1);
    } else if (cleaned.startsWith("256")) {
        // already correct
    } else {
        cleaned = "256" + cleaned;
    }

    return cleaned;
}

// ---------------------------------------------
// MOCKED REQUEST TO PAY CONTROLLER
// ---------------------------------------------
const requestToPay = async (req, res) => {
    try {
        const { amount, phone, externalId, mock, studentId, schoolId } = req.body;

        // Normalize phone
        const normalizedPhone = normalizePhone(phone);
        console.log("Normalized phone:", normalizedPhone);

        // MOCK MODE
        console.log("⚠️ MOCK MODE ENABLED — No MTN Request Sent");

        // SAVE PAYMENT (Fix missing fields + status enum)
        await Payments.create({
            studentId,        // <-- REQUIRED (ADDED)
            schoolId,         // <-- REQUIRED (ADDED)
            phone: normalizedPhone,
            amount,
            externalId,
            status: "Pending", // <-- FIXED ENUM ("Pending" not "PENDING")
            providerMessage: "MTN mock successful"
        });

        return res.status(200).json({
            message: "MOCK: MTN request simulated",
            externalId,
            phone: normalizedPhone
        });
    } catch (error) {
        console.log("Payment Error:", error.message);
        res.status(500).json({ message: "Payment failed", error: error.message });
    }
};

module.exports = { requestToPay };
