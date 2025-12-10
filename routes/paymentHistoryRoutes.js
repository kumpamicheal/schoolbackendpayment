const express = require("express");
const router = express.Router();
const { getPaymentHistory } = require("../controllers/paymentHistoryController");

// Fetch payment history for a student
router.get("/:studentId", getPaymentHistory);

module.exports = router;
