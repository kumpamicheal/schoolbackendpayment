const express = require("express");
const router = express.Router();
const { requestToPay, makePayment } = require("../controllers/paymentsController");

// Existing mock request
router.post("/request", requestToPay);

// New endpoint to actually make payment and update balance
router.post("/make", makePayment);

module.exports = router;
