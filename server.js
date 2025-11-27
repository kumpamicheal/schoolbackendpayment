const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const cors = require("cors");

dotenv.config();
connectDB();

const app = express();
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/schools", require("./routes/schoolRoutes"));
app.use("/api/company", require("./routes/companyRoutes"));
app.use("/api/auth", require("./routes/authRoutes"));

// ⭐ NEW: Student Routes (added without editing anything else)
app.use("/api/students", require("./routes/studentRoutes"));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
