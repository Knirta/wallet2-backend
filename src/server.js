import express from "express";
import morgan from "morgan";
import cors from "cors";

import { getEnvVar } from "./helpers/index.js";
import authRouter from "./routers/api/authRouter.js";

const PORT = Number(getEnvVar("PORT", 3000));

export const startServer = () => {
  const app = express();

  app.use(morgan("tiny"));
  app.use(express.json());
  app.use(cors());

  app.use("/api/auth", authRouter);

  app.use((req, res, next) => {
    res.status(404).json({
      message: "Route not found",
    });
  });

  app.use((err, req, res, next) => {
    res.status(500).json({
      message: "Something went wrong",
      error: err.message,
    });
  });

  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
};
