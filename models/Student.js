const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema({
    name: { type: String, required: true },
    classLevel: { type: String, required: true },
    stream: { type: String, required: true },
    paymentCode: { type: String, required: true, unique: true },
    parentPhone: { type: String, default: "" }
});

module.exports = mongoose.model("Student", studentSchema);
