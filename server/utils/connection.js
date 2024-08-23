import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();
const connectionString = process.env.MONGODB_URL;

export const connect = async () => {
  try {
    await mongoose.connect(connectionString);
    console.log("Successfully connected to MongoDB");
  } catch (err) {
    console.error("Error connecting to MongoDB:", err);
  }
};
