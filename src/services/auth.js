import bcrypt from "bcryptjs";
import gravatar from "gravatar";
import { nanoid } from "nanoid";
import { User } from "../models/user.js";
import { Session } from "../models/session.js";
import {
  HttpError,
  sendVerificationEmail,
  createTokens,
} from "../helpers/index.js";

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

  if (!user) {
    throw HttpError(401, "Невірна пошта або пароль");
  }

  if (!user.verified) {
    throw HttpError(401, "Підтвердіть свою пошту перед входом");
  }

  const passwordMatch = await bcrypt.compare(password, user.password);

  if (!passwordMatch) {
    throw HttpError(401, "Невірна пошта або пароль");
  }

  await Session.deleteOne({ userId: user._id });

  const tokens = createTokens(user._id);

  const session = await Session.create({ userId: user._id, ...tokens });

  return {
    session,
    user: {
      name: user.name,
      email: user.email,
      avatarURL: user.avatarURL,
      currency: user.currency,
      totalBalance: user.totalBalance || 0,
    },
  };
};

const logoutUser = async (sessionId) => {
  await Session.deleteOne({ _id: sessionId });
};

export {
  registerUser,
  verifyUserEmail,
  resendVerificationUserEmail,
  loginUser,
  logoutUser,
};
