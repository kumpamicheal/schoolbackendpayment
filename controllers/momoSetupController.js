const axios = require("axios");
const { v4: uuidv4 } = require("uuid");

const COLLECTION_PRIMARY_KEY = process.env.MOMO_SUBSCRIPTION_KEY; // Your sandbox subscription key

/**
 * Create MoMo sandbox API user and generate API key
 */
const setupSandboxUser = async (req, res) => {
    try {
        // Step 1: Generate a new UUID for your API user
        const apiUserId = uuidv4();

        // Step 2: Create API user
        const createUserRes = await axios.post(
            "https://sandbox.momodeveloper.mtn.com/v1_0/apiuser",
            { providerCallbackHost: "https://your-server/callback" }, // optional
            {
                headers: {
                    "X-Reference-Id": apiUserId,
                    "Ocp-Apim-Subscription-Key": COLLECTION_PRIMARY_KEY,
                    "Content-Type": "application/json",
                },
            }
        );

        // Step 3: Generate API key for the created user
        const apiKeyRes = await axios.post(
            `https://sandbox.momodeveloper.mtn.com/v1_0/apiuser/${apiUserId}/apikey`,
            {},
            {
                headers: {
                    "Ocp-Apim-Subscription-Key": COLLECTION_PRIMARY_KEY,
                    "Content-Type": "application/json",
                },
            }
        );

        // Step 4: Send back credentials
        return res.json({
            MOMO_USER_ID: apiUserId,
            MOMO_API_KEY: apiKeyRes.data.apiKey,
            MOMO_SUBSCRIPTION_KEY: COLLECTION_PRIMARY_KEY,
        });
    } catch (error) {
        console.error("MoMo Setup Error:", error.response?.data || error.message);
        return res.status(500).json({ error: "Failed to setup sandbox user" });
    }
};

module.exports = { setupSandboxUser };
