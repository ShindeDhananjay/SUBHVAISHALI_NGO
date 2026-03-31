import { Request, Response } from "express";
import { ContactMessage } from "../models/ContactMessage.ts";

export const submitContact = async (req: Request, res: Response) => {
  try {
    const message = await ContactMessage.create(req.body);
    res.status(201).json({ message: "Message sent successfully", data: message });
  } catch (error) {
    res.status(400).json({ message: "Error sending message", error });
  }
};

export const getMessages = async (req: Request, res: Response) => {
  try {
    const messages = await ContactMessage.find().sort({ createdAt: -1 });
    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

export const markAsRead = async (req: Request, res: Response) => {
  try {
    const message = await ContactMessage.findByIdAndUpdate(req.params.id, { isRead: true }, { new: true });
    if (!message) return res.status(404).json({ message: "Message not found" });
    res.json(message);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};
