import bcrypt from "bcryptjs";
import gravatar from "gravatar";
import { nanoid } from "nanoid";
import handlebars from "handlebars";
import path, { dirname } from "path";
import { fileURLToPath } from "url";
import fs from "fs/promises";
import { sendEmail } from "../utils/index.js";
import { User } from "../models/user.js";
import { HttpError, getEnvVar } from "../helpers/index.js";

const FRONTEND_URL = getEnvVar("FRONTEND_URL");

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const tempatesDir = path.join(__dirname, "../", "templates");

const sendVerificationEmail = async (user) => {
  const verifyEmailTemplatePath = path.join(tempatesDir, "verifyEmail.html");
  const templateSource = await fs.readFile(verifyEmailTemplatePath, "utf-8");
  const template = handlebars.compile(templateSource);

  const html = template({
    name: user.username,
    link: `${FRONTEND_URL}/verify-email?code=${user.verificationCode}`,
  });

  const verifyEmailData = {
    to: user.email,
    subject: "Підтвердження реєстрації на Wallet App",
    html,
  };

  try {
    await sendEmail(verifyEmailData);
    console.log("Verification email sent successfully");
    // eslint-disable-next-line no-unused-vars
  } catch (error) {
    throw HttpError(
      503,
      "Не вдалося надіслати лист для підтвердження реєстрації",
    );
  }
};

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

  return user;
};

export {
  registerUser,
  verifyUserEmail,
  resendVerificationUserEmail,
  loginUser,
};
