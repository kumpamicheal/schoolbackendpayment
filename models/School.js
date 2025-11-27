const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const schoolSchema = new mongoose.Schema(
    {
        name: { type: String, required: true },
        headTeacher: { type: String, required: true },
        location: { type: String, required: true },
        email: { type: String, required: true, unique: true },
        phone: { type: String, required: true },

        subscription: { type: String },
        paymentMethod: { type: String },

        studentsCount: { type: Number, default: 0 },
        subscriptionAmount: { type: Number, default: 0 },

        password: { type: String, required: true },  // <== ADMIN LOGIN PASSWORD

        subscriptionStart: { type: Date },
        subscriptionEnd: { type: Date },

        status: { type: String, default: "Active" }
    },
    { timestamps: true }
);

// 🔥 HASH PASSWORD BEFORE SAVING
schoolSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();
    this.password = await bcrypt.hash(this.password, 10);
    next();
});

module.exports = mongoose.model("School", schoolSchema);
