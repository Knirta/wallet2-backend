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
import { getEnvVar } from "../helpers/index.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const tempatesDir = path.join(__dirname, "../", "templates");

const BASE_URL = getEnvVar("BASE_URL");

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
    link: `${BASE_URL}/api/auth/verify/${newUser.verificationCode}`,
  });

  const verifyEmailData = {
    to: newUser.email,
    subject: "Підтвердження реєстрації на Wallet App",
    html,
  };

  try {
    await sendEmail(verifyEmailData);
  } catch (error) {
    console.error("Помилка надсилання електронного листа:", error);
  }

  return newUser;
};

export { registerUser };
