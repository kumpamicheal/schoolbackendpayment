import GeneralFee from "../models/GeneralFee.js";
import OptionalFee from "../models/OptionalFee.js";
import SpecialFee from "../models/SpecialFee.js";

// =============================
// GENERAL SCHOOL FEES
// =============================

// Add
export const addGeneralFee = async (req, res) => {
    try {
        const fee = await GeneralFee.create(req.body);
        res.status(201).json(fee);
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
};

// Get all
export const getGeneralFees = async (req, res) => {
    try {
        const fees = await GeneralFee.find();
        res.json(fees);
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
};

// Update
export const updateGeneralFee = async (req, res) => {
    try {
        const updated = await GeneralFee.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(updated);
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
};

// Delete
export const deleteGeneralFee = async (req, res) => {
    try {
        await GeneralFee.findByIdAndDelete(req.params.id);
        res.json({ message: "Deleted" });
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
};


// =============================
// OPTIONAL FEES
// =============================

// Add
export const addOptionalFee = async (req, res) => {
    try {
        const fee = await OptionalFee.create(req.body);
        res.status(201).json(fee);
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
};

// Get all
export const getOptionalFees = async (req, res) => {
    try {
        const fees = await OptionalFee.find();
        res.json(fees);
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
};

// Update
export const updateOptionalFee = async (req, res) => {
    try {
        const updated = await OptionalFee.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(updated);
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
};

// Delete
export const deleteOptionalFee = async (req, res) => {
    try {
        await OptionalFee.findByIdAndDelete(req.params.id);
        res.json({ message: "Deleted" });
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
};


// =============================
// SPECIAL FEES (per student)
// =============================

// Add
export const addSpecialFee = async (req, res) => {
    try {
        const fee = await SpecialFee.create(req.body);
        res.status(201).json(fee);
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
};

// Get all
export const getSpecialFees = async (req, res) => {
    try {
        const fees = await SpecialFee.find();
        res.json(fees);
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
};

// Update
export const updateSpecialFee = async (req, res) => {
    try {
        const updated = await SpecialFee.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(updated);
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
};

// Delete
export const deleteSpecialFee = async (req, res) => {
    try {
        await SpecialFee.findByIdAndDelete(req.params.id);
        res.json({ message: "Deleted" });
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
};
