const axios = require("axios");
const Payments = require("../models/Payments");

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
        // fallback (not recommended but safe)
        cleaned = "256" + cleaned;
    }

    return cleaned;
}

// ---------------------------------------------
// MAKE PAYMENT CONTROLLER
// ---------------------------------------------
exports.makePayment = async (req, res) => {
    try {
        const { amount, phone, externalId, mock } = req.body;

        // Normalize phone into 2567XXXXXXXX
        const normalizedPhone = normalizePhone(phone);

        console.log("Normalized phone:", normalizedPhone);

        // ---------------------------------------------
        // MOCK MODE (TEMPORARY TO AVOID INVALID CURRENCY)
        // ---------------------------------------------
        if (mock === true) {
            console.log("⚠️ MOCK MODE ENABLED — No MTN Request Sent");

            await Payments.create({
                phone: normalizedPhone,
                amount,
                externalId,
                status: "PENDING",
                providerMessage: "MTN mock successful"
            });

            return res.status(200).json({
                message: "MOCK: MTN request simulated",
                externalId,
                phone: normalizedPhone
            });
        }

        // ---------------------------------------------
        // REAL MTN REQUEST (WHEN YOU GO LIVE)
        // ---------------------------------------------
        const momoResponse = await axios.post(
            "https://sandbox.momodeveloper.mtn.com/collection/v1_0/requesttopay",
            {
                amount: String(amount),
                currency: "USD", // USD for sandbox
                externalId: externalId,
                payer: {
                    partyIdType: "MSISDN",
                    partyId: normalizedPhone
                },
                payerMessage: "School Fees",
                payeeNote: "Payment"
            },
            {
                headers: {
                    "X-Reference-Id": externalId,
                    "Ocp-Apim-Subscription-Key": process.env.MOMO_PRIMARY_KEY,
                    "X-Target-Environment": "sandbox",
                    "Content-Type": "application/json"
                }
            }
        );

        console.log("MTN Response:", momoResponse.status);

        await Payments.create({
            phone: normalizedPhone,
            amount,
            externalId,
            status: "PENDING",
            providerMessage: "MTN request sent"
        });

        res.status(200).json({
            message: "MTN request sent successfully",
            externalId,
            phone: normalizedPhone
        });

    } catch (error) {
        console.log("Payment Error:", error.response?.data || error.message);

        res.status(500).json({
            message: "Payment failed",
            error: error.response?.data || error.message
        });
    }
};
