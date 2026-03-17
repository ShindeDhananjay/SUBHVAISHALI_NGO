import mongoose from "mongoose";

let isConnected = false;

export const connectDB = async () => {
  if (isConnected) return;

  try {
    let mongoUri = process.env.MONGODB_URI;
    
    if (!mongoUri) {
      console.log("MONGODB_URI not found. Attempting to start in-memory MongoDB...");
      try {
        const { MongoMemoryServer } = await import("mongodb-memory-server");
        const mongoServer = await MongoMemoryServer.create();
        mongoUri = mongoServer.getUri();
      } catch (e) {
        throw new Error("MONGODB_URI is required in production. In-memory MongoDB is only available in development.");
      }
    }

    await mongoose.connect(mongoUri, { 
      serverSelectionTimeoutMS: 5000 
    });
    
    isConnected = true;
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("MongoDB connection error:", error);
    // Fallback for demo
    if (!isConnected) {
      try {
        const { MongoMemoryServer } = await import("mongodb-memory-server");
        const mongoServer = await MongoMemoryServer.create();
        await mongoose.connect(mongoServer.getUri());
        isConnected = true;
        console.log("Connected to fallback in-memory MongoDB");
      } catch (e) {
        console.error("Could not start fallback MongoDB. Please provide a valid MONGODB_URI.");
      }
    }
  }
};
