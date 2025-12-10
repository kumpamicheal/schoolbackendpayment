const express = require("express");
const router = express.Router();

// Import controller functions
const paymentController = require("../controllers/paymentController");

// Destructure only the functions you have
const { requestToPay } = paymentController;

// Validate that imported handler is a function
if (typeof requestToPay !== "function") {
    throw new Error("requestToPay must be a function in paymentController");
}

// Routes
router.post("/request", requestToPay); // Request payment

module.exports = router;
