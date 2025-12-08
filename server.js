const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const cors = require("cors");

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();

// ----------------------------------------
// ✅ CORS FIX (WORKS WITH LOCALHOST + RENDER)
// ----------------------------------------
const allowedOrigins = [
    "http://localhost:3000",                     // React Dev Server
    "https://schoolbackendpayment.onrender.com", // Your backend deployed URL
];

app.use(cors({
    origin: function (origin, callback) {
        // Allow requests like Postman with no origin
        if (!origin) return callback(null, true);

        if (!allowedOrigins.includes(origin)) {
            const msg = "❌ CORS BLOCKED: Origin not allowed";
            return callback(new Error(msg), false);
        }

        return callback(null, true);
    },
    methods: "GET,POST,PUT,DELETE",
    allowedHeaders: "Content-Type, Authorization",
    credentials: true,
}));

// Handle Preflight OPTIONS Requests (IMPORTANT!)
app.options("*", cors());

// ----------------------------------------
// Middleware
// ----------------------------------------
app.use(express.json());

// ----------------------------------------
// Routes
// ----------------------------------------
app.use("/api/schools", require("./routes/schoolRoutes"));
app.use("/api/company", require("./routes/companyRoutes"));
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/parent", require("./routes/parentRoutes"));
app.use("/api/students", require("./routes/studentRoutes"));
app.use("/api/fees", require("./routes/feesRoutes"));
app.use("/api/transactionFeeRoutes", require("./routes/transactionFeeRoutes"));
app.use("/api/myschool", require("./routes/mySchoolRoutes"));
app.use("/api/payments", require("./routes/paymentRoutes"));

// Test Route
app.get("/", (req, res) => {
    res.send("API is running...");
});

// ----------------------------------------
// Start Server
// ----------------------------------------
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`✅ Server running on port ${PORT}`);
});
