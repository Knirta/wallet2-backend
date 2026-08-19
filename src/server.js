import express from "express";
import morgan from "morgan";
import cors from "cors";
import cookieParser from "cookie-parser";
import path from "path";
import { fileURLToPath } from "url";

import { getEnvVar } from "./helpers/index.js";
import authRouter from "./routers/api/authRouter.js";
import categoriesRouter from "./routers/api/categoriesRouter.js";
import transactionsRouter from "./routers/api/transactionsRouter.js";
import currencyRouter from "./routers/api/currencyRouter.js";

const PORT = Number(getEnvVar("PORT", 3000));

export const startServer = () => {
  const app = express();

  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);

  app.use(
    cors({
      origin: ["http://localhost:5173", "https://wallet-bay-pi.vercel.app"],
      credentials: true,
    }),
  );
  app.use(morgan("tiny"));
  app.use(express.json());
  app.use(cookieParser());
  app.use("/docs-assets", express.static(path.join(__dirname, "../docs")));

  app.use("/api/auth", authRouter);
  app.use("/api/categories", categoriesRouter);
  app.use("/api/transactions", transactionsRouter);
  app.use("/api/currency", currencyRouter);
  app.get("/api-docs", (req, res) => {
    res.sendFile(path.join(__dirname, "../docs/redoc-static.html"));
  });

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
