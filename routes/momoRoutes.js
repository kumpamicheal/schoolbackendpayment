const express = require("express");
const router = express.Router();
const { requestToPay, checkPaymentStatus } = require("../controllers/momoController");


// POST /api/momo/request => initiate payment
router.post("/request", requestToPay);

// GET /api/momo/status/:externalId => check payment status
router.get("/status/:externalId", checkPaymentStatus);

module.exports = router;
