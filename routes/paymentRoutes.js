const express = require("express");
const router = express.Router();
const { requestPayment, paymentCallback } = require("../controllers/paymentController");

// Parent triggers payment
router.post("/request", requestPayment);

// MTN sends callback
router.post("/callback", paymentCallback);

module.exports = router;
