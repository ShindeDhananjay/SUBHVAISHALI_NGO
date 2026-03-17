import mongoose from "mongoose";

const certificateSchema = new mongoose.Schema({
  volunteerId: { type: mongoose.Schema.Types.ObjectId, ref: "Volunteer", required: true },
  volunteerName: { type: String, required: true },
  issueDate: { type: Date, default: Date.now },
  certificateId: { type: String, required: true, unique: true },
  pdfUrl: { type: String, required: true },
}, { timestamps: true });

export const Certificate = mongoose.model("Certificate", certificateSchema);
