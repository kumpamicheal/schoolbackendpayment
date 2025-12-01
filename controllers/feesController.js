const GeneralFee = require("../models/GeneralFee");
const OptionalFee = require("../models/OptionalFee");
const SpecialFee = require("../models/SpecialFee");

// =============================
// GENERAL FEES
// =============================
exports.addGeneralFee = async (req, res) => {
    try {
        const fee = await GeneralFee.create(req.body);
        res.status(201).json(fee);
    } catch (error) {
        console.error("Error adding general fee:", error);
        res.status(500).json({ message: "Server error" });
    }
};

exports.getGeneralFees = async (req, res) => {
    try {
        const fees = await GeneralFee.find();
        res.json(fees);
    } catch (error) {
        console.error("Error fetching general fees:", error);
        res.status(500).json({ message: "Server error" });
    }
};

exports.updateGeneralFee = async (req, res) => {
    try {
        const updated = await GeneralFee.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updated) return res.status(404).json({ message: "General fee not found" });
        res.json(updated);
    } catch (error) {
        console.error("Error updating general fee:", error);
        res.status(500).json({ message: "Server error" });
    }
};

exports.deleteGeneralFee = async (req, res) => {
    try {
        await GeneralFee.findByIdAndDelete(req.params.id);
        res.json({ message: "Deleted" });
    } catch (error) {
        console.error("Error deleting general fee:", error);
        res.status(500).json({ message: "Server error" });
    }
};

// =============================
// OPTIONAL FEES
// =============================
exports.addOptionalFee = async (req, res) => {
    try {
        const fee = await OptionalFee.create(req.body);
        res.status(201).json(fee);
    } catch (error) {
        console.error("Error adding optional fee:", error);
        res.status(500).json({ message: "Server error" });
    }
};

exports.getOptionalFees = async (req, res) => {
    try {
        const fees = await OptionalFee.find();
        res.json(fees);
    } catch (error) {
        console.error("Error fetching optional fees:", error);
        res.status(500).json({ message: "Server error" });
    }
};

exports.updateOptionalFee = async (req, res) => {
    try {
        const updated = await OptionalFee.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updated) return res.status(404).json({ message: "Optional fee not found" });
        res.json(updated);
    } catch (error) {
        console.error("Error updating optional fee:", error);
        res.status(500).json({ message: "Server error" });
    }
};

exports.deleteOptionalFee = async (req, res) => {
    try {
        await OptionalFee.findByIdAndDelete(req.params.id);
        res.json({ message: "Deleted" });
    } catch (error) {
        console.error("Error deleting optional fee:", error);
        res.status(500).json({ message: "Server error" });
    }
};

// =============================
// SPECIAL FEES
// =============================
exports.addSpecialFee = async (req, res) => {
    try {
        const fee = await SpecialFee.create(req.body);
        res.status(201).json(fee);
    } catch (error) {
        console.error("Error adding special fee:", error);
        res.status(500).json({ message: "Server error" });
    }
};

exports.getSpecialFees = async (req, res) => {
    try {
        const fees = await SpecialFee.find();
        res.json(fees);
    } catch (error) {
        console.error("Error fetching special fees:", error);
        res.status(500).json({ message: "Server error" });
    }
};

exports.updateSpecialFee = async (req, res) => {
    try {
        const updated = await SpecialFee.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updated) return res.status(404).json({ message: "Special fee not found" });
        res.json(updated);
    } catch (error) {
        console.error("Error updating special fee:", error);
        res.status(500).json({ message: "Server error" });
    }
};

exports.deleteSpecialFee = async (req, res) => {
    try {
        await SpecialFee.findByIdAndDelete(req.params.id);
        res.json({ message: "Deleted" });
    } catch (error) {
        console.error("Error deleting special fee:", error);
        res.status(500).json({ message: "Server error" });
    }
};
