import { Resend } from "resend";
import { getEnvVar } from "../helpers/index.js";

const RESEND_API_KEY = getEnvVar("RESEND_API_KEY");

const resend = new Resend(RESEND_API_KEY);

const sendEmail = async (data) => {
  const email = { ...data, from: "korolchuk.kate.work@gmail.com" };
  await resend.emails.send(email);
  return true;
};

export default sendEmail;
