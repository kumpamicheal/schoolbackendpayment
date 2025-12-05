const express = require("express");
const router = express.Router();
const { setupSandboxUser } = require("../controllers/momoSetupController");

router.post("/setup-sandbox-user", setupSandboxUser);

module.exports = router;
