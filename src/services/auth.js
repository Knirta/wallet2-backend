import bcrypt from "bcryptjs";
import gravatar from "gravatar";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import { nanoid } from "nanoid";
import { User } from "../models/user.js";
import { Session } from "../models/session.js";
import {
  HttpError,
  sendVerificationEmail,
  createTokens,
  getEnvVar,
} from "../helpers/index.js";

const JWT_REFRESH_SECRET = getEnvVar("JWT_REFRESH_SECRET");

const registerUser = async (payload) => {
  const user = await User.findOne({ email: payload.email });
  if (user) {
    throw HttpError(409, "Користувач із такою поштою вже зареєстрований");
  }

  const hashedPassword = await bcrypt.hash(payload.password, 10);
  const avatarURL = gravatar.url(
    payload.email,
    {
      s: "200",
      r: "pg",
      d: "retro",
    },
    true,
  );
  const verificationCode = nanoid();

  const newUser = await User.create({
    ...payload,
    password: hashedPassword,
    avatarURL,
    verificationCode,
  });

  await sendVerificationEmail(newUser);

  return newUser;
};

const verifyUserEmail = async (verificationCode) => {
  const user = await User.findOne({ verificationCode });

  if (!user) {
    throw HttpError(404, "Користувача не знайдено");
  }

  await User.findByIdAndUpdate(user._id, {
    verified: true,
    verificationCode: "",
  });
};

const resendVerificationUserEmail = async (email) => {
  const user = await User.findOne({ email });

  if (!user) {
    throw HttpError(404, "Користувача не знайдено");
  }

  if (user.verified) {
    throw HttpError(400, "Email вже підтверджено");
  }

  await sendVerificationEmail(user);
};

const loginUser = async (payload) => {
  const { email, password } = payload;
  const user = await User.findOne({ email });

  const passwordMatch = user
    ? await bcrypt.compare(password, user.password)
    : false;

  if (!user || !passwordMatch) {
    throw HttpError(401, "Невірна пошта або пароль");
  }

  if (!user.verified) {
    throw HttpError(403, "Підтвердіть свою пошту перед входом");
  }

  const newSession = await Session.create({ userId: user._id });

  const tokens = createTokens(user._id, newSession._id);

  const updatedSession = await Session.findByIdAndUpdate(
    newSession._id,
    {
      ...tokens,
    },
    { new: true },
  );

  return {
    session: updatedSession,
    user: {
      name: user.name,
      email: user.email,
      avatarURL: user.avatarURL,
      currency: user.currency,
      totalBalance: user.totalBalance || 0,
    },
  };
};

const logoutUser = async (refreshToken) => {
  await Session.deleteOne({ refreshToken });
};

const refreshSession = async (oldRefreshToken) => {
  try {
    const { userId, sessionId } = jwt.verify(
      oldRefreshToken,
      JWT_REFRESH_SECRET,
    );

    const oldSession = await Session.findOneAndDelete({
      _id: sessionId,
      refreshToken: oldRefreshToken,
    });

    if (!oldSession) {
      throw HttpError(401, "Сесія не знайдена");
    }

    const user = await User.findById(userId);
    if (!user) {
      throw HttpError(401, "Користувача не знайдено");
    }
    const newSessionId = new mongoose.Types.ObjectId();
    const tokens = createTokens(user._id, newSessionId);

    const newSession = await Session.create({
      _id: newSessionId,
      userId: user._id,
      ...tokens,
    });

    return {
      session: newSession,
      user: {
        name: user.name,
        email: user.email,
        avatarURL: user.avatarURL,
        currency: user.currency,
        totalBalance: user.totalBalance || 0,
      },
    };
  } catch (error) {
    throw HttpError(401, error.message || "Невалідний refresh token");
  }
};

export {
  registerUser,
  verifyUserEmail,
  resendVerificationUserEmail,
  loginUser,
  logoutUser,
  refreshSession,
};
