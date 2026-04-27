import express from "express";
import ctrl from "../../controllers/categoriesController.js";
import { authenticate } from "../../middlewares/index.js";

const categoriesRouter = express.Router();

categoriesRouter.get("/", authenticate, ctrl.getCategories);

export default categoriesRouter;
