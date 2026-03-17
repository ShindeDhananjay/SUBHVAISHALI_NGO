import mongoose from "mongoose";

const donationSchema = new mongoose.Schema({
  donorName: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String },
  amount: { type: Number, required: true },
  currency: { type: String, default: "INR" },
  paymentId: { type: String, required: true },
  orderId: { type: String },
  method: { type: String, default: "Razorpay" },
  status: { type: String, enum: ["pending", "successful", "failed"], default: "pending" },
}, { timestamps: true });

export const Donation = mongoose.model("Donation", donationSchema);
