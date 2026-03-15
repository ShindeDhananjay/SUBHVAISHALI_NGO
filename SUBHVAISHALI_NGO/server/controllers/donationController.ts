import { Request, Response } from "express";
import { Donation } from "../models/Donation.js";

export const recordDonationIntent = async (req: Request, res: Response) => {
  try {
    const { donorName, email, phone, amount, method } = req.body;

    const donation = await Donation.create({
      donorName,
      email,
      phone,
      amount,
      paymentId: `intent_${Date.now()}`,
      orderId: `upi_${Date.now()}`,
      status: "pending", // UPI payments are manual, so we mark as pending
      method: method || "UPI"
    });

    res.json({ message: "Donation intent recorded", donation });
  } catch (error) {
    console.error("Error recording donation intent:", error);
    res.status(500).json({ message: "Error recording donation intent", error });
  }
};

export const getDonations = async (req: Request, res: Response) => {
  try {
    const donations = await Donation.find().sort({ createdAt: -1 });
    res.json(donations);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

export const updateDonation = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const donation = await Donation.findByIdAndUpdate(id, req.body, { new: true });
    if (!donation) return res.status(404).json({ message: "Donation not found" });
    res.json(donation);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

export const deleteDonation = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const donation = await Donation.findByIdAndDelete(id);
    if (!donation) return res.status(404).json({ message: "Donation not found" });
    res.json({ message: "Donation deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// Placeholder for backward compatibility if needed, but we'll remove them from routes
export const createOrder = async (req: Request, res: Response) => {
  res.status(410).json({ message: "Razorpay integration removed. Use /donations/intent instead." });
};

export const verifyPayment = async (req: Request, res: Response) => {
  res.status(410).json({ message: "Razorpay integration removed. Use /donations/intent instead." });
};
