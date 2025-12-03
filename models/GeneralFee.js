const mongoose = require("mongoose");

const GeneralFeeSchema = new mongoose.Schema({
    schoolId: {
        type: String,
        required: true
    },
    class: {
        type: String,
        required: true
    },
    term: {
        type: String,
        required: true
    },
    amount: {
        type: Number,
        required: true
    }
}, { timestamps: true });

module.exports = mongoose.model("GeneralFee", GeneralFeeSchema);

