import bcrypt from "bcryptjs";
import gravatar from "gravatar";
import { nanoid } from "nanoid";
import handlebars from "handlebars";
import path, { dirname } from "path";
import { fileURLToPath } from "url";
import fs from "fs/promises";
import { sendEmail } from "../utils/index.js";
import { User } from "../models/user.js";
import { HttpError } from "../helpers/index.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const tempatesDir = path.join(__dirname, "../", "templates");

const registerUser = async (payload) => {
  const user = await User.findOne({ email: payload.email });
  if (user) {
    throw HttpError(409, "Email is already in use");
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

  const verifyEmailTemplatePath = path.join(tempatesDir, "verifyEmail.html");

  const templateSource = await fs.readFile(verifyEmailTemplatePath, "utf-8");

  const template = handlebars.compile(templateSource);

  const html = template({
    name: newUser.username,
    link: `http://localhost:5173/verify-email/${newUser.verificationCode}`,
  });

  const verifyEmailData = {
    to: newUser.email,
    subject: "Підтвердження реєстрації на Wallet App",
    html,
  };

  try {
    await sendEmail(verifyEmailData);
    // eslint-disable-next-line no-unused-vars
  } catch (error) {
    throw HttpError(503, "Failed to send verification email");
  }

  return newUser;
};

const verifyUserEmail = async (verificationCode) => {
  const user = await User.findOne({ verificationCode });

  if (!user) {
    throw HttpError(404, "User not found");
  }

  await User.findByIdAndUpdate(user._id, {
    verified: true,
    verificationCode: "",
  });
};

export { registerUser, verifyUserEmail };
