import mongoose from "mongoose";

const eventSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  date: { type: Date, required: true },
  location: { type: String, required: true },
  imageUrl: { type: String },
  status: { type: String, enum: ["upcoming", "ongoing", "completed"], default: "upcoming" },
}, { timestamps: true });

export const Event = mongoose.model("Event", eventSchema);
