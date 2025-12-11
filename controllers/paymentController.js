const Payments = require("../models/Payment");

// ---------------------------------------------
// PHONE NORMALIZER
// ---------------------------------------------
function normalizePhone(phone) {
    let cleaned = phone.trim();

    if (cleaned.startsWith("+256")) {
        cleaned = cleaned.replace("+256", "256");
    } else if (cleaned.startsWith("0")) {
        cleaned = "256" + cleaned.substring(1);
    } else if (cleaned.startsWith("256")) {
        // OK
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

        console.log("⚠️ MOCK MODE ENABLED — No MTN Request Sent");

        // SAVE PAYMENT (ONLY FIX REQUIRED FIELDS)
        await Payments.create({
            studentId,
            schoolId,
            phone: normalizedPhone,
            amount,
            externalId,
            method: "mtn",       // ✅ FIXED (REQUIRED)
            status: "pending",   // ✅ FIXED ENUM (lowercase)
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
