import mongoose from "mongoose";

export const connectDB = async () => {
  if (mongoose.connection.readyState >= 1) {
    console.log("Using existing MongoDB connection");
    return;
  }

  try {
    const mongoUri = process.env.MONGODB_URI;
    
    if (!mongoUri) {
      if (process.env.NODE_ENV === "production") {
        throw new Error("MONGODB_URI environment variable is missing. Please add it to Vercel Settings > Environment Variables.");
      }
      console.log("MONGODB_URI not found. Attempting to start in-memory MongoDB for development...");
      const { MongoMemoryServer } = await import("mongodb-memory-server");
      const mongoServer = await MongoMemoryServer.create();
      await mongoose.connect(mongoServer.getUri());
      console.log("Connected to in-memory MongoDB");
      return;
    }

    console.log("Attempting to connect to MongoDB...");
    const maskedUri = mongoUri.replace(/\/\/.*:.*@/, "//***:***@");
    console.log(`Using URI: ${maskedUri}`);

    await mongoose.connect(mongoUri, { 
      serverSelectionTimeoutMS: 8000, // 8s timeout to fit within Vercel's 10s limit
    });
    
    console.log("Successfully connected to MongoDB Atlas");
  } catch (error: any) {
    console.error("MongoDB connection error details:", {
      message: error.message,
      code: error.code,
      name: error.name
    });
    throw error;
  }
};
