import mongoose from "mongoose";

const volunteerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true },
  address: { type: String },
  skills: [{ type: String }],
  status: { type: String, enum: ["pending", "approved", "rejected"], default: "pending" },
  hoursCompleted: { type: Number, default: 0 },
}, { timestamps: true });

export const Volunteer = mongoose.model("Volunteer", volunteerSchema);
