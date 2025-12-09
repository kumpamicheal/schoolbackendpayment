const express = require("express");
const router = express.Router();
const { requestToPay } = require("../controllers/paymentController");

// Parent triggers payment (mocked)
router.post("/request", requestToPay);

// -----------------------------
// Commented out MTN callback route since we're mocking
// router.post("/callback", paymentCallback);
// -----------------------------

module.exports = router;
