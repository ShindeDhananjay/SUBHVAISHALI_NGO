import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import apiRoutes from "./routes/index.ts";
import { connectDB } from "./db.ts";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

// API Routes
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", env: process.env.NODE_ENV });
});

app.get("/api/db-status", async (req, res) => {
  try {
    const mongoose = (await import("mongoose")).default;
    const state = mongoose.connection.readyState;
    const states = ["disconnected", "connected", "connecting", "disconnecting"];
    
    await connectDB();
    
    res.json({ 
      status: "attempted", 
      connectionState: states[state] || state,
      hasUri: !!process.env.MONGODB_URI,
      uriStart: process.env.MONGODB_URI ? process.env.MONGODB_URI.substring(0, 15) + "..." : "none"
    });
  } catch (error: any) {
    res.status(500).json({ 
      status: "error", 
      message: error.message,
      stack: process.env.NODE_ENV === "production" ? undefined : error.stack
    });
  }
});

app.use("/api", async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (error: any) {
    console.error("API Error:", error);
    res.status(500).json({ 
      message: "Database connection failed. Please check your configuration.",
      error: error.message // Temporarily exposing error message for debugging
    });
  }
}, apiRoutes);

// Global error handler
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error("Unhandled Error:", err);
  res.status(err.status || 500).json({
    message: err.message || "An unexpected error occurred",
    error: process.env.NODE_ENV === "production" ? undefined : err.stack
  });
});

export default app;
