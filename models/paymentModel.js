const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema({
    studentId: { type: mongoose.Schema.Types.ObjectId, ref: "Student", required: true },
    schoolId: { type: mongoose.Schema.Types.ObjectId, ref: "School", required: true },
    amount: { type: Number, required: true },
    phone: { type: String, required: true },
    externalId: { type: String, required: true, unique: true },
    status: { type: String, enum: ["Pending", "Completed", "Failed"], default: "Pending" },
    payerMessage: { type: String },
    payeeNote: { type: String },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Payment", paymentSchema);
