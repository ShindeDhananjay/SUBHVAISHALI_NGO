import { Request, Response } from "express";
import { Activity } from "../models/Activity.js";

export const getActivities = async (req: Request, res: Response) => {
  try {
    const activities = await Activity.find().sort({ date: -1 });
    res.json(activities);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

export const createActivity = async (req: Request, res: Response) => {
  try {
    const activity = await Activity.create(req.body);
    res.status(201).json(activity);
  } catch (error) {
    res.status(400).json({ message: "Error creating activity", error });
  }
};

export const updateActivity = async (req: Request, res: Response) => {
  try {
    const activity = await Activity.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!activity) return res.status(404).json({ message: "Activity not found" });
    res.json(activity);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

export const deleteActivity = async (req: Request, res: Response) => {
  try {
    const activity = await Activity.findByIdAndDelete(req.params.id);
    if (!activity) return res.status(404).json({ message: "Activity not found" });
    res.json({ message: "Activity deleted" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};
