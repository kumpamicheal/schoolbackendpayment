const mongoose = require("mongoose");

const GeneralFeeSchema = new mongoose.Schema({
    class: { type: String, required: true },
    term: { type: String, required: true },
    amount: { type: Number, required: true }
}, { timestamps: true });

module.exports = mongoose.model("GeneralFee", GeneralFeeSchema);
