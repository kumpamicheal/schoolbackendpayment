const express = require("express");
const router = express.Router();

// Import controller functions
const paymentController = require("../controllers/paymentController");

// Make sure these exist and are functions
const { requestToPay, makePayment } = paymentController;

// Validate that imported handlers are functions
if (typeof requestToPay !== "function") {
    throw new Error("requestToPay must be a function in paymentController");
}
if (typeof makePayment !== "function") {
    throw new Error("makePayment must be a function in paymentController");
}

// Routes
router.post("/request", requestToPay);   // Request payment
router.post("/make", makePayment);       // Make payment

module.exports = router;
