import express from "express";
import ctrl from "../../controllers/transactionsController.js";
import { authenticate } from "../../middlewares/index.js";

const transactionsRouter = express.Router();

transactionsRouter.post("/", authenticate, ctrl.addTransaction);

transactionsRouter.get("/", authenticate, ctrl.getTransactions);

export default transactionsRouter;
