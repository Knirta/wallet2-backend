import express from "express";
import morgan from "morgan";
import cors from "cors";
import cookieParser from "cookie-parser";

import { getEnvVar } from "./helpers/index.js";
import authRouter from "./routers/api/authRouter.js";
import categoriesRouter from "./routers/api/categoriesRouter.js";

const PORT = Number(getEnvVar("PORT", 3000));

export const startServer = () => {
  const app = express();

  app.use(
    cors({
      origin: ["http://localhost:5173", "https://wallet-bay-pi.vercel.app"],
      credentials: true,
    }),
  );
  app.use(morgan("tiny"));
  app.use(express.json());
  app.use(cookieParser());

  app.use("/api/auth", authRouter);
  app.use("/api/categories", categoriesRouter);

  app.use((req, res, next) => {
    res.status(404).json({
      message: "Route not found",
    });
  });

  app.use((err, req, res, next) => {
    const { status = 500, message = "Server error" } = err;
    res.status(status).json({ message });
  });

  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
};
