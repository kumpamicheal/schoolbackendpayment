// routes/transactionsRoutes.js
const express = require("express");
const { getTransactions } = require("../controllers/transactionsController");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// GET all transactions for the logged-in school
router.get("/", authMiddleware, getTransactions);

module.exports = router;
