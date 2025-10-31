import mongoose from "mongoose";

const jobSchema = new mongoose.Schema({
  userEmail: { type: String, required: true },
  tailor: { type: mongoose.Schema.Types.ObjectId, ref: "Tailor", required: true },
  workType: { type: String, enum: ["light", "heavy"], required: true },
  status: { type: String, enum: ["requested","accepted","in_progress","finished_by_tailor","awaiting_user_confirmation","rider_assigned","delivered","closed","cancelled"], default: "requested" },
  estimatedMinutes: { type: Number },
  images: [{ type: String }],
  messages: [{ sender: String, text: String, createdAt: Date }],
  price: { type: Number },
  createdAt: { type: Date, default: Date.now },
  acceptedAt: Date,
  startedAt: Date,
  finishedAt: Date,
  confirmedAt: Date
});

export default mongoose.model("Job", jobSchema);
