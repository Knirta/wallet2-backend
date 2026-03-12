import {
  registerUser,
  verifyUserEmail,
  resendVerificationUserEmail,
  loginUser,
  logoutUser,
  refreshSession,
} from "../services/auth.js";
import { ctrlWrapper } from "../helpers/index.js";
import { REFRESH_DURATION_SEC } from "../constants/index.js";

const cookieOptions = {
  httpOnly: true,
  // secure: true, //для продакшн
  maxAge: REFRESH_DURATION_SEC * 1000,
};

const register = async (req, res) => {
  const newUser = await registerUser(req.body);

  res.status(201).json({
    status: "success",
    code: 201,
    message: "Користувач успішно зареєстрований",
    data: {
      name: newUser.name,
      email: newUser.email,
    },
  });
};

const verifyEmail = async (req, res) => {
  const { verificationCode } = req.body;

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

const login = async (req, res) => {
  const result = await loginUser(req.body);

  res.cookie("refreshToken", result.session.refreshToken, cookieOptions);

  res.status(200).json({
    status: "success",
    code: 200,
    message: "Успішний вхід",
    data: {
      user: result.user,
      token: result.session.accessToken,
    },
  });
};

const logout = async (req, res) => {
  const { refreshToken } = req.cookies;

  if (refreshToken) {
    await logoutUser(refreshToken);
  }

  res.clearCookie("refreshToken", cookieOptions);

  res.status(204).send();
};

const refresh = async (req, res) => {
  const { refreshToken: oldRefreshToken } = req.cookies;

  if (!oldRefreshToken) {
    return res.status(401).json({
      status: "error",
      code: 401,
      message: "Відсутній refresh token або session ID",
    });
  }

  const result = await refreshSession(oldRefreshToken);

  res.cookie("refreshToken", result.session.refreshToken, cookieOptions);

  res.status(200).json({
    status: "success",
    code: 200,
    message: "Сесія оновлена",
    data: {
      user: result.user,
      token: result.session.accessToken,
    },
  });
};

export default {
  register: ctrlWrapper(register),
  verifyEmail: ctrlWrapper(verifyEmail),
  resendVerificationEmail: ctrlWrapper(resendVerificationEmail),
  login: ctrlWrapper(login),
  logout: ctrlWrapper(logout),
  refresh: ctrlWrapper(refresh),
};
