import {
  registerUser,
  verifyUserEmail,
  resendVerificationUserEmail,
} from "../services/auth.js";
import { ctrlWrapper } from "../helpers/index.js";

const register = async (req, res) => {
  const newUser = await registerUser(req.body);

  res.status(201).json({
    status: "success",
    code: 201,
    message: "Користувач успішно зареєстрований",
    data: {
      username: newUser.username,
      email: newUser.email,
    },
  });
};

const verifyEmail = async (req, res) => {
  console.log("body", req.body);
  const { verificationCode } = req.body;
  console.log("verificationCode", verificationCode);

  await verifyUserEmail(verificationCode);

  res.status(204).json({
    status: "success",
    code: 204,
    message: "Email успішно підтверджено",
  });
};

const resendVerificationEmail = async (req, res) => {
  const { email } = req.body;
  await resendVerificationUserEmail(email);

  res.status(200).json({
    status: "success",
    code: 200,
    message: "Лист для підтвердження реєстрації успішно відправлено",
  });
};

export default {
  register: ctrlWrapper(register),
  verifyEmail: ctrlWrapper(verifyEmail),
  resendVerificationEmail: ctrlWrapper(resendVerificationEmail),
};
