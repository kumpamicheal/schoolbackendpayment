import mongoose from "mongoose";

const SpecialFeeSchema = new mongoose.Schema({
    student: { type: String, required: true },
    class: { type: String, required: true },
    term: { type: String, required: true },
    amount: { type: Number, required: true }
}, { timestamps: true });

export default mongoose.model("SpecialFee", SpecialFeeSchema);
