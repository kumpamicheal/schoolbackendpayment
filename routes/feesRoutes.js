const express = require("express");
const {
    addGeneralFee,
    getGeneralFees,
    updateGeneralFee,
    deleteGeneralFee,

    addOptionalFee,
    getOptionalFees,
    updateOptionalFee,
    deleteOptionalFee,

    addSpecialFee,
    getSpecialFees,
    updateSpecialFee,
    deleteSpecialFee
} = require("../controllers/feesController");

const router = express.Router();

// General Fees
router.post("/general", addGeneralFee);
router.get("/general", getGeneralFees);
router.put("/general/:id", updateGeneralFee);
router.delete("/general/:id", deleteGeneralFee);

// Optional Fees
router.post("/optional", addOptionalFee);
router.get("/optional", getOptionalFees);
router.put("/optional/:id", updateOptionalFee);
router.delete("/optional/:id", deleteOptionalFee);

// Special Fees
router.post("/special", addSpecialFee);
router.get("/special", getSpecialFees);
router.put("/special/:id", updateSpecialFee);
router.delete("/special/:id", deleteSpecialFee);

module.exports = router;
