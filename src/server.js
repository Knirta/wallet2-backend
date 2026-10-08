import express from "express";
import morgan from "morgan";
import cors from "cors";
import cookieParser from "cookie-parser";
import path from "path";
import swaggerJSDoc from "swagger-jsdoc";
import fs from "fs";
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

  const swaggerOptions = {
    definition: {
      openapi: "3.1.0",
      info: {
        title: "Wallet App",
        version: "1.0.0",
        description:
          "Документація до додатку Wallet App. Тут описані всі доступні ендпоінти, їх параметри та приклади запитів і відповідей.",
        license: {
          name: "Apache 2.0",
          url: "http://apache.org",
        },
      },
      servers: [
        { url: "http://localhost:3000" },
        { url: "https://wallet-api-nitl.onrender.com" },
      ],
      tags: [
        {
          name: "Auth",
          description:
            "Реєстрація користувача, верифікація електронної пошти, повторне надсилання листа та аутентифікація.",
        },
        {
          name: "Transactions",
          description: "Відображення та додавання транзакцій.",
        },
        {
          name: "Categories",
          description: "Відображення категорій.",
        },
      ],
      components: {
        securitySchemes: {
          bearerAuth: {
            type: "http",
            scheme: "bearer",
          },
        },
      },
    },
    apis: [path.join(__dirname, "./routers/api/*.js")],
  };

  const swaggerSpec = swaggerJSDoc(swaggerOptions);

  const docsPath = path.join(__dirname, "../docs/swagger.json");
  fs.writeFileSync(docsPath, JSON.stringify(swaggerSpec, null, 2));

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
