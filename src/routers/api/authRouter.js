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

authRouter.post(
  "/verify-email",
  validateBody(schemas.verifyEmailSchema),
  ctrl.verifyEmail,
);

authRouter.post(
  "/resend-verification",
  validateBody(schemas.resendVerificationEmailSchema),
  ctrl.resendVerificationEmail,
);

authRouter.post("/login", validateBody(schemas.loginSchema), ctrl.login);

authRouter.post("/logout", ctrl.logout);

export default authRouter;
