import express from "express";
import { authenticate } from "../../middlewares/index.js";
import ctrl from "../../controllers/currencyController.js";

const currencyRouter = express.Router();

currencyRouter.get("/", authenticate, ctrl.getExchangeRate);

export default currencyRouter;
