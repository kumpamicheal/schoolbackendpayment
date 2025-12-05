const axios = require("axios");

// Replace with your sandbox credentials
const API_USER_ID = "YOUR_API_USER_ID";
const API_KEY = "YOUR_API_KEY";
const SUBSCRIPTION_KEY = "YOUR_SUBSCRIPTION_KEY"; // from dashboard

// Generate Basic Auth header
const basicAuth = Buffer.from(`${API_USER_ID}:${API_KEY}`).toString("base64");

// ============================
// 1️⃣ Generate Access Token
// ============================
async function getAccessToken() {
    try {
        const response = await axios.post(
            "https://sandbox.momodeveloper.mtn.com/collection/token/",
            {},
            {
                headers: {
                    Authorization: `Basic ${basicAuth}`,
                    "Ocp-Apim-Subscription-Key": SUBSCRIPTION_KEY
                }
            }
        );
        return response.data.access_token;
    } catch (err) {
        console.error("Error getting access token:", err.response?.data || err.message);
        throw new Error("Failed to get MoMo access token");
    }
}

// ============================
// 2️⃣ Request Payment
// ============================
async function requestToPay(req, res) {
    try {
        const { amount, phone, externalId, payerMessage, payeeNote } = req.body;

        if (!amount || !phone || !externalId) {
            return res.status(400).json({ message: "Missing required fields" });
        }

        const accessToken = await getAccessToken();

        const response = await axios.post(
            "https://sandbox.momodeveloper.mtn.com/collection/v1_0/requesttopay",
            {
                amount: amount.toString(),
                currency: "UGX",
                externalId,
                payer: { partyIdType: "MSISDN", partyId: phone },
                payerMessage: payerMessage || "School fees payment",
                payeeNote: payeeNote || "School payment"
            },
            {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    "X-Reference-Id": externalId,
                    "Ocp-Apim-Subscription-Key": SUBSCRIPTION_KEY,
                    "Content-Type": "application/json"
                }
            }
        );

        res.status(200).json({
            message: "Payment request sent",
            referenceId: externalId
        });
    } catch (err) {
        console.error("Error requesting payment:", err.response?.data || err.message);
        res.status(500).json({ message: "Failed to initiate payment" });
    }
}

module.exports = { requestToPay };
