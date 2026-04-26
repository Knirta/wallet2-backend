import mongoose from "mongoose";
import { getEnvVar } from "../helpers/index.js";
import { seedCategories } from "../seaders/categorySeader.js";

export const initMongoDB = async () => {
  try {
    const MONGODB_USER = getEnvVar("MONGODB_USER");
    const MONGODB_PASSWORD = getEnvVar("MONGODB_PASSWORD");
    const MONGODB_URL = getEnvVar("MONGODB_URL");
    const MONGODB_DB = getEnvVar("MONGODB_DB");

    const uri = `mongodb+srv://${MONGODB_USER}:${MONGODB_PASSWORD}@${MONGODB_URL}/${MONGODB_DB}?retryWrites=true&w=majority`;
    await mongoose.connect(uri);
    await seedCategories();
    console.log("✅ MongoDB connection established and categories seeded.");
  } catch (error) {
    console.error("❌ Error initializing MongoDB:", error);
  }
};
