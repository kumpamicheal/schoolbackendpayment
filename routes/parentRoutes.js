const express = require("express");
const router = express.Router();
const { parentLogin } = require("../controllers/parentController");

// -------------------------------------
// PARENT LOGIN ROUTE
// -------------------------------------
router.post("/login", parentLogin);

module.exports = router;
