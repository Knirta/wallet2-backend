import sgMail from "@sendgrid/mail";
import { getEnvVar } from "../helpers/index.js";

const SENDGRID_API_KEY = getEnvVar("SENDGRID_API_KEY");

sgMail.setApiKey(SENDGRID_API_KEY);

const sendEmail = async (data) => {
  const email = { ...data, from: "korolchuk.kate.work@gmail.com" };
  await sgMail.send(email);
  return true;
};

export default sendEmail;
