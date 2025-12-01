import mongoose from "mongoose";

const OptionalFeeSchema = new mongoose.Schema({
    name: { type: String, required: true },
    amount: { type: Number, required: true }
}, { timestamps: true });

export default mongoose.model("OptionalFee", OptionalFeeSchema);
