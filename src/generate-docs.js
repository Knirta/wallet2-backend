import { fileURLToPath } from "url";
import path from "path";
import swaggerJSDoc from "swagger-jsdoc";
import fs from "fs";

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
console.log("✅ swagger.json successfully generated!");
