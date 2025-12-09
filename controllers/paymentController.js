const axios = require("axios");
const { v4: uuidv4 } = require("uuid");
const Payment = require("../models/Payment");
const Student = require("../models/Student");
const School = require("../models/School");

// MTN Sandbox Credentials
const API_USER_ID = process.env.MOMO_USER_ID;
const API_KEY = process.env.MOMO_API_KEY;
const SUBSCRIPTION_KEY = process.env.MOMO_SUBSCRIPTION_KEY;
const ENVIRONMENT = "sandbox";

// Generate Basic Auth header
const basicAuth = Buffer.from(`${API_USER_ID}:${API_KEY}`).toString("base64");

// ============================
// 1️⃣ Generate Access Token
// ============================
async function getAccessToken() {
    try {
        console.log("🔹 Requesting MTN access token...");
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
        console.log("✅ MTN access token received");
        return response.data.access_token;
    } catch (err) {
        console.error("❌ Error getting access token:", err.response?.data || err.message);
        throw new Error("Failed to get MoMo access token");
    }
}

// ============================
// 2️⃣ Request Payment
// ============================
async function requestToPay(req, res) {
    try {
        console.log("💰 Incoming payment request:", req.body);

        const { studentId, amount, phone, payerMessage, payeeNote } = req.body;

        if (!studentId || !amount || !phone) {
            console.warn("⚠ Missing required fields", { studentId, amount, phone });
            return res.status(400).json({ message: "Missing required fields" });
        }

        // 1️⃣ Find the student
        const student = await Student.findById(studentId);
        if (!student) {
            console.warn("⚠ Student not found:", studentId);
            return res.status(404).json({ message: "Student not found" });
        }
        console.log("✅ Student found:", student);

        // 2️⃣ Find the school
        const school = await School.findById(student.schoolId);
        if (!school) {
            console.warn("⚠ School not found:", student.schoolId);
            return res.status(404).json({ message: "School not found" });
        }
        console.log("✅ School found:", school);

        // 3️⃣ Generate unique externalId for MTN
        const externalId = uuidv4();
        console.log("🔹 Generated externalId:", externalId);

        // 4️⃣ Create Payment record in DB
        const payment = await Payment.create({
            studentId: student._id,
            schoolId: school._id,
            amount,
            phone,
            externalId,
            status: "Pending",
            payerMessage: payerMessage || "School fees payment",
            payeeNote: payeeNote || `Payment for ${student.name}`
        });
        console.log("✅ Payment record created:", payment);

        // 5️⃣ Call MTN API to request payment
        const accessToken = await getAccessToken();
        console.log("🔹 Sending request to MTN API...");

        await axios.post(
            "https://sandbox.momodeveloper.mtn.com/collection/v1_0/requesttopay",
            {
                amount: amount.toString(),
                currency: "USD",
                externalId,
                payer: { partyIdType: "MSISDN", partyId: phone },
                payerMessage: payment.payerMessage,
                payeeNote: payment.payeeNote
            },
            {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    "X-Reference-Id": externalId,
                    "X-Target-Environment": ENVIRONMENT,
                    "Ocp-Apim-Subscription-Key": SUBSCRIPTION_KEY,
                    "Content-Type": "application/json"
                }
            }
        );
        console.log("✅ MTN request sent successfully");

        res.status(200).json({
            message: "Payment request sent",
            paymentId: payment._id,
            externalId
        });

    } catch (err) {
        console.error("❌ Error requesting payment:", err.response?.data || err.message);
        res.status(500).json({ message: "Failed to initiate payment" });
    }
}

// ============================
// 3️⃣ MTN Callback Handler
// ============================
async function paymentCallback(req, res) {
    try {
        console.log("🔹 Payment callback received:", req.body);
        const data = req.body;

        const { externalId, amount, status, financialTransactionId } = data;

        // Find Payment by externalId
        const payment = await Payment.findOne({ externalId });
        if (!payment) {
            console.warn("⚠ Payment not found for externalId:", externalId);
            return res.status(404).send("Payment not found");
        }
        console.log("✅ Payment found:", payment);

        // Update Payment status
        payment.status = status || "Failed";
        payment.transactionId = financialTransactionId;
        await payment.save();
        console.log("✅ Payment status updated");

        // If successful, mark student as PAID
        if (status === "SUCCESSFUL") {
            const student = await Student.findById(payment.studentId);
            student.paymentStatus = "PAID";
            student.lastPayment = new Date();
            student.lastPaymentAmount = amount;
            student.transactionId = financialTransactionId;
            await student.save();
            console.log("✅ Student payment status updated to PAID");
        }

        res.status(200).send("Callback received");
    } catch (err) {
        console.error("❌ Callback error:", err.message);
        res.status(500).send("Callback error");
    }
}

module.exports = { requestToPay, paymentCallback };
