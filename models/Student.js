const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema({
    studentId: { type: Number, unique: true },
    name: { type: String, required: true },
    classLevel: { type: String, required: true },
    stream: { type: String, required: true },
    parentPhone: { type: String, required: true },
    paymentCode: { type: String, required: true, unique: true }
});

// AUTO INCREMENT ID
studentSchema.pre("save", async function (next) {
    if (this.studentId) return next();

    const lastStudent = await mongoose
        .model("Student")
        .findOne()
        .sort({ studentId: -1 });

    this.studentId = lastStudent ? lastStudent.studentId + 1 : 1;

    next();
});

module.exports = mongoose.model("Student", studentSchema);
