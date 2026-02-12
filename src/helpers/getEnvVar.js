import dotenv from "dotenv";

dotenv.config();

const getEnvVar = (key, defaultVaue) => {
  const value = process.env[key];

  if (value) return value;

  if (defaultVaue) return defaultVaue;

  throw new Error(`Missing: process.env['${key}']`);
};

export default getEnvVar;
