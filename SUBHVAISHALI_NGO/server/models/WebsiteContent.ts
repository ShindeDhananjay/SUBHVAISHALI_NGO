import mongoose from "mongoose";

const websiteContentSchema = new mongoose.Schema({
  key: { type: String, required: true, unique: true }, // e.g., 'homepage_hero', 'about_mission'
  value: { type: mongoose.Schema.Types.Mixed, required: true }, // can be string, object, array
}, { timestamps: true });

export const WebsiteContent = mongoose.model("WebsiteContent", websiteContentSchema);
