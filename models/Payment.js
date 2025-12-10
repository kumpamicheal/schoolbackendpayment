const mongoose = require("mongoose");

const PaymentSchema = new mongoose.Schema({
    studentId: { type: String, required: true },   // added
    schoolId: { type: String, required: true },    // added
    phone: { type: String, required: true },
    amount: { type: Number, required: true },
    method: { type: String, required: true },
    status: {
        type: String,
        enum: ["pending", "failed", "Success"],    // pending + failed + Success
        default: "pending"                         // default to lowercase pending
    },
    externalId: { type: String },                  // optional externalId
    providerMessage: { type: String },             // optional message
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Payment", PaymentSchema);
