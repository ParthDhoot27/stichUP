import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  creditLimit: { type: Number, default: 5 },
  creditsUsed: { type: Number, default: 0 },
});

export default mongoose.model("User", userSchema);
