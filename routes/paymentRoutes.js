const express = require("express");
const router = express.Router();
const { requestToPay, paymentCallback } = require("../controllers/paymentController");

// Parent triggers payment
router.post("/request", requestToPay);

// MTN sends callback
router.post("/callback", paymentCallback);

module.exports = router;
