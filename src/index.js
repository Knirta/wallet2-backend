import { startServer } from "./server.js";
import { initMongoDB } from "./db/initMongoDB.js";

const startApp = async () => {
  try {
    await initMongoDB();
    console.log("MongoDB initialized successfully");
    startServer();
  } catch (error) {
    console.error("Failed to initialize MongoDB:", error.message);
    process.exit(1);
  }
};

startApp();
