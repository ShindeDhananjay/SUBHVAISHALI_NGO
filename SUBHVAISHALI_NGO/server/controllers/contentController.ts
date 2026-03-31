import { Request, Response } from "express";
import { WebsiteContent } from "../models/WebsiteContent.ts";

export const getContent = async (req: Request, res: Response) => {
  try {
    const content = await WebsiteContent.find();
    const contentMap = content.reduce((acc: any, item: any) => {
      acc[item.key] = item.value;
      return acc;
    }, {});
    res.json(contentMap);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

export const updateContent = async (req: Request, res: Response) => {
  try {
    const { key, value } = req.body;
    const content = await WebsiteContent.findOneAndUpdate(
      { key },
      { value },
      { new: true, upsert: true }
    );
    res.json(content);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

export const updateMultipleContent = async (req: Request, res: Response) => {
  try {
    const updates = req.body; // Array of { key, value }
    const results = await Promise.all(
      updates.map((update: any) =>
        WebsiteContent.findOneAndUpdate(
          { key: update.key },
          { value: update.value },
          { new: true, upsert: true }
        )
      )
    );
    res.json(results);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};
