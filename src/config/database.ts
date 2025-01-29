import mongoose from "mongoose";
import dotenvFlow from "dotenv-flow";

dotenvFlow.config();

const MONGO_URI = process.env.MONGO_URI || "";

export async function connectDB() {
    try {
        await mongoose.connect(MONGO_URI); 
        console.log("✅ MongoDB Connected!");
    } catch (error) {
        console.error("❌ MongoDB Connection Failed:", error);
        process.exit(1);
    }
}