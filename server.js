const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const cors = require("cors");

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();

// ✅ CORS Configuration
const allowedOrigins = [
    "http://localhost:3000", // React dev server
    "https://your-frontend-deployed-url.onrender.com" // Your deployed frontend URL
];

app.use(cors({
    origin: function(origin, callback) {
        // allow requests with no origin (like Postman)
        if (!origin) return callback(null, true);
        if (allowedOrigins.indexOf(origin) === -1) {
            const msg = "The CORS policy for this site does not allow access from the specified Origin.";
            return callback(new Error(msg), false);
        }
        return callback(null, true);
    },
    credentials: true // required if you use cookies/auth
}));

// ✅ Middleware to parse JSON
app.use(express.json());

// ✅ Routes
app.use("/api/schools", require("./routes/schoolRoutes"));
app.use("/api/company", require("./routes/companyRoutes"));
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/parent", require("./routes/parentRoutes"));
app.use("/api/students", require("./routes/studentRoutes"));
app.use("/api/fees", require("./routes/feesRoutes"));
app.use("/api/transactionFeeRoutes", require("./routes/transactionFeeRoutes"));
app.use("/api/myschool", require("./routes/mySchoolRoutes"));
app.use("/api/momo", require("./routes/momoRoutes"));
app.use("/api/momo-setup", require("./routes/momoSetupRoutes"));


// Root route for testing
app.get("/", (req, res) => {
    res.send("API is running...");
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
