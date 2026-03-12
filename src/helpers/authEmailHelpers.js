import handlebars from "handlebars";
import path, { dirname } from "path";
import { fileURLToPath } from "url";
import fs from "fs/promises";
import { sendEmail } from "../helpers/index.js";
import { HttpError, getEnvVar } from "../helpers/index.js";

const FRONTEND_URL = getEnvVar("FRONTEND_URL");

let cachedTemplate = null;

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const templatesDir = path.join(__dirname, "../", "templates");

export const sendVerificationEmail = async (user) => {
  if (!cachedTemplate) {
    const verifyEmailTemplatePath = path.join(templatesDir, "verifyEmail.html");
    const templateSource = await fs.readFile(verifyEmailTemplatePath, "utf-8");
    cachedTemplate = handlebars.compile(templateSource);
  }

  const html = cachedTemplate({
    name: user.name,
    link: `${FRONTEND_URL}/verify-email?code=${user.verificationCode}`,
  });

  const verifyEmailData = {
    to: user.email,
    subject: "Підтвердження реєстрації на Wallet App",
    html,
  };

  try {
    await sendEmail(verifyEmailData);
    // eslint-disable-next-line no-unused-vars
  } catch (error) {
    throw HttpError(
      503,
      "Не вдалося надіслати лист для підтвердження реєстрації",
    );
  }
};
