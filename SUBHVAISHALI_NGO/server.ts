import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";
import apiRoutes from "./server/routes/index.js";
import fs from "fs";
import { connectDB } from "./server/db.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();
if (fs.existsSync(".env.example")) {
  const envConfig = dotenv.parse(fs.readFileSync(".env.example"));
  for (const k in envConfig) {
    if (!process.env[k]) {
      process.env[k] = envConfig[k];
    }
  }
}

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

export { app };

async function startServer() {
  const PORT = 3000;

  await connectDB();

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    // Serve static files in production
    app.use(express.static("dist"));
    app.get("*", (req, res) => {
      res.sendFile(path.resolve(__dirname, "dist", "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

// Only start the server if this file is run directly
if (process.env.NODE_ENV !== "production" || (!process.env.NETLIFY && !process.env.VERCEL)) {
  startServer();
}
