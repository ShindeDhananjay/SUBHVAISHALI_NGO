import { Request, Response } from "express";
import { Volunteer } from "../models/Volunteer.ts";

export const registerVolunteer = async (req: Request, res: Response) => {
  try {
    const volunteer = await Volunteer.create(req.body);
    res.status(201).json(volunteer);
  } catch (error) {
    res.status(400).json({ message: "Error registering volunteer", error });
  }
};

export const getVolunteers = async (req: Request, res: Response) => {
  try {
    const volunteers = await Volunteer.find().sort({ createdAt: -1 });
    res.json(volunteers);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

export const updateVolunteerStatus = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const volunteer = await Volunteer.findByIdAndUpdate(id, { status }, { new: true });
    if (!volunteer) return res.status(404).json({ message: "Volunteer not found" });
    res.json(volunteer);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

export const updateVolunteer = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const volunteer = await Volunteer.findByIdAndUpdate(id, req.body, { new: true });
    if (!volunteer) return res.status(404).json({ message: "Volunteer not found" });
    res.json(volunteer);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

export const deleteVolunteer = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const volunteer = await Volunteer.findByIdAndDelete(id);
    if (!volunteer) return res.status(404).json({ message: "Volunteer not found" });
    res.json({ message: "Volunteer deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};
