import express from "express";
import app from "./server/app.js";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";
import { connectDB } from "./server/db.js";
import dotenv from "dotenv";

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

export { app };
