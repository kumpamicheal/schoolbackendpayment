const axios = require("axios");
const { v4: uuidv4 } = require("uuid");

const COLLECTION_PRIMARY_KEY = process.env.MOMO_SUBSCRIPTION_KEY; // your subscription key
const API_USER_ID = process.env.MOMO_USER_ID;                      // your sandbox user ID
const API_KEY = process.env.MOMO_API_KEY;                          // your sandbox API key
const ENVIRONMENT = "sandbox";                                     // "sandbox" for testing

// ----------------------------
// 1️⃣ Generate Access Token
// ----------------------------
const getAccessToken = async () => {
    const tokenUrl = `https://sandbox.momodeveloper.mtn.com/collection/token/`;
    const auth = Buffer.from(`${API_USER_ID}:${API_KEY}`).toString("base64");

    const response = await axios.post(
        tokenUrl,
        {},
        {
            headers: {
                Authorization: `Basic ${auth}`,
                "Ocp-Apim-Subscription-Key": COLLECTION_PRIMARY_KEY
            }
        }
    );

    return response.data.access_token; // expires in ~30 min
};

// ----------------------------
// 2️⃣ Request Payment
// ----------------------------
const requestToPay = async (req, res) => {
    try {
        const { amount, phone } = req.body;
        const externalId = uuidv4();
        const token = await getAccessToken();

        const response = await axios.post(
            `https://sandbox.momodeveloper.mtn.com/collection/v1_0/requesttopay`,
            {
                amount,
                currency: "UGX",
                externalId,
                payer: {
                    partyIdType: "MSISDN",
                    partyId: phone
                },
                payerMessage: "School Fee Payment",
                payeeNote: "School Payment"
            },
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "X-Reference-Id": externalId,
                    "X-Target-Environment": ENVIRONMENT,
                    "Ocp-Apim-Subscription-Key": COLLECTION_PRIMARY_KEY,
                    "Content-Type": "application/json"
                }
            }
        );

        return res.json({ message: "Payment initiated", externalId });
    } catch (err) {
        console.error("Request to Pay Error:", err.response?.data || err.message);
        return res.status(500).json({ error: "Failed to initiate payment" });
    }
};

// ----------------------------
// 3️⃣ Check Payment Status
// ----------------------------
const checkPaymentStatus = async (req, res) => {
    try {
        const { externalId } = req.params;
        const token = await getAccessToken();

        const response = await axios.get(
            `https://sandbox.momodeveloper.mtn.com/collection/v1_0/requesttopay/${externalId}`,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "X-Target-Environment": ENVIRONMENT,
                    "Ocp-Apim-Subscription-Key": COLLECTION_PRIMARY_KEY
                }
            }
        );

        return res.json({ status: response.data.status, externalId });
    } catch (err) {
        console.error("Check Payment Status Error:", err.response?.data || err.message);
        return res.status(500).json({ error: "Failed to check payment status" });
    }
};

// ----------------------------
// 4️⃣ Export
// ----------------------------
module.exports = { requestToPay, checkPaymentStatus };
