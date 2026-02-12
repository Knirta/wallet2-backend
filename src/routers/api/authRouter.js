import express from "express";
import { validateBody } from "../../middlewares/index.js";
import { schemas } from "../../models/user.js";
import ctrl from "../../controllers/authController.js";

const authRouter = express.Router();

authRouter.post(
  "/register",
  validateBody(schemas.registerSchema),
  ctrl.register,
);

export default authRouter;
