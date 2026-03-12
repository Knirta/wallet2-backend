import { Resend } from "resend";
import { getEnvVar } from "./index.js";

const RESEND_API_KEY = getEnvVar("RESEND_API_KEY");

const resend = new Resend(RESEND_API_KEY);

const sendEmail = async (data) => {
  const email = { ...data, from: "Wallet App <info@wallet-2.pp.ua>" };
  const { error } = await resend.emails.send(email);
  if (error) {
    throw new Error(`Failed to send email: ${error.message}`);
  }
  return true;
};

export default sendEmail;
