import mongoose from "mongoose";

let isConnected = false;

export const connectDB = async () => {
  if (isConnected) return;

  try {
    const mongoUri = process.env.MONGODB_URI;
    
    if (!mongoUri) {
      if (process.env.NODE_ENV === "production") {
        throw new Error("MONGODB_URI is required in production. Please check your Vercel environment variables.");
      }
      console.log("MONGODB_URI not found. Attempting to start in-memory MongoDB for development...");
      const { MongoMemoryServer } = await import("mongodb-memory-server");
      const mongoServer = await MongoMemoryServer.create();
      await mongoose.connect(mongoServer.getUri());
      isConnected = true;
      console.log("Connected to in-memory MongoDB");
      return;
    }

    await mongoose.connect(mongoUri, { 
      serverSelectionTimeoutMS: 10000 // Increased timeout for serverless
    });
    
    isConnected = true;
    console.log("Connected to MongoDB Atlas");
  } catch (error) {
    console.error("MongoDB connection error:", error);
    if (process.env.NODE_ENV === "production") {
      throw error; // Let the middleware catch it
    }
    
    // Fallback for local development only
    if (!isConnected) {
      try {
        const { MongoMemoryServer } = await import("mongodb-memory-server");
        const mongoServer = await MongoMemoryServer.create();
        await mongoose.connect(mongoServer.getUri());
        isConnected = true;
        console.log("Connected to fallback in-memory MongoDB");
      } catch (e) {
        console.error("Could not start fallback MongoDB.");
        throw e;
      }
    }
  }
};
