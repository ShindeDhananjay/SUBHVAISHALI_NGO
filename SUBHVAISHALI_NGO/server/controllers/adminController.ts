import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { Admin } from "../models/Admin.js";

const JWT_SECRET = process.env.JWT_SECRET || "fallback_secret";

export const loginAdmin = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    
    // For demo purposes, if no admin exists, create one
    let admin = await Admin.findOne({ email });
    if (!admin && email === "admin@example.com") {
      const hashedPassword = await bcrypt.hash("admin123", 10);
      admin = await Admin.create({ email, password: hashedPassword, name: "Super Admin" });
    }

    if (!admin) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const payload = { id: admin._id, email: admin.email };
    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "1d" });

    res.json({ token, admin: { id: admin._id, name: admin.name, email: admin.email } });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

export const getDashboardStats = async (req: Request, res: Response) => {
  try {
    const { Volunteer } = await import("../models/Volunteer.js");
    const { Donation } = await import("../models/Donation.js");
    const { Event } = await import("../models/Event.js");
    const { Certificate } = await import("../models/Certificate.js");

    const totalVolunteers = await Volunteer.countDocuments();
    const totalDonations = await Donation.countDocuments();
    const totalEvents = await Event.countDocuments();
    const totalCertificates = await Certificate.countDocuments();

    res.json({
      totalVolunteers,
      totalDonations,
      totalEvents,
      totalCertificates
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

export const updateCredentials = async (req: Request, res: Response) => {
  try {
    const { email, currentPassword, newPassword } = req.body;
    const adminId = (req as any).admin.id;

    const admin = await Admin.findById(adminId);
    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }

    const isMatch = await bcrypt.compare(currentPassword, admin.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Incorrect current password" });
    }

    if (email) {
      // Check if email is already taken by another admin
      const existingAdmin = await Admin.findOne({ email, _id: { $ne: adminId } });
      if (existingAdmin) {
        return res.status(400).json({ message: "Email already in use" });
      }
      admin.email = email;
    }

    if (newPassword) {
      admin.password = await bcrypt.hash(newPassword, 10);
    }

    await admin.save();
    res.json({ message: "Credentials updated successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};
