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

const authMiddleware = require("../middleware/authMiddleware"); // <-- import

const router = express.Router();

// General Fees
router.post("/general", authMiddleware, addGeneralFee);
router.get("/general", authMiddleware, getGeneralFees);
router.put("/general/:id", authMiddleware, updateGeneralFee);
router.delete("/general/:id", authMiddleware, deleteGeneralFee);

// Optional Fees
router.post("/optional", authMiddleware, addOptionalFee);
router.get("/optional", authMiddleware, getOptionalFees);
router.put("/optional/:id", authMiddleware, updateOptionalFee);
router.delete("/optional/:id", authMiddleware, deleteOptionalFee);

// Special Fees
router.post("/special", authMiddleware, addSpecialFee);
router.get("/special", authMiddleware, getSpecialFees);
router.put("/special/:id", authMiddleware, updateSpecialFee);
router.delete("/special/:id", authMiddleware, deleteSpecialFee);

module.exports = router;
