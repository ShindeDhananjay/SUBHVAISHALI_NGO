import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import apiRoutes from "./routes/index.js";
import { connectDB } from "./db.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

// API Routes
app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

app.use("/api", async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (error: any) {
    console.error("API Error:", error);
    res.status(500).json({ 
      message: "Database connection failed. Please check your configuration.",
      error: process.env.NODE_ENV === "production" ? undefined : error.message 
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
