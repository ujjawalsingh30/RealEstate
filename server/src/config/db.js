import mongoose from "mongoose";

const connectDB = async () => {
  try {
    mongoose.connection.on('connected', () => {
      console.log("✅ MongoDB Connected Successfully to Real Estate Database");
    });

    mongoose.connection.on('error', (err) => {
      console.error("❌ MongoDB Connection Error:", err.message);
    });

    mongoose.connection.on('disconnected', () => {
      console.warn("⚠️ MongoDB Disconnected");
    });

    const dbURI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017';
    // Append realestate_db as the default database name
    const connectionString = dbURI.includes('?') 
      ? dbURI 
      : `${dbURI.replace(/\/$/, '')}/realestate_db`;

    const conn = await mongoose.connect(connectionString);
    console.log(`📡 MongoDB Host: ${conn.connection.host}`);
  } catch (error) {
    console.error("❌ Failed to connect to MongoDB:", error.message);
    console.error("💡 Tip: Ensure local MongoDB server is running or check your MONGODB_URI in the server/.env file.");
  }
};

export default connectDB;
