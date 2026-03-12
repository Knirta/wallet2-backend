import jwt from "jsonwebtoken";
import getEnvVar from "./getEnvVar.js";

const JWT_ACCESS_SECRET = getEnvVar("JWT_ACCESS_SECRET");
const JWT_REFRESH_SECRET = getEnvVar("JWT_REFRESH_SECRET");

const createSession = (id) => {
  const tokenPayload = {
    id,
  };

  const accessToken = jwt.sign(tokenPayload, JWT_ACCESS_SECRET, {
    expiresIn: "15m",
  });
  const refreshToken = jwt.sign(tokenPayload, JWT_REFRESH_SECRET, {
    expiresIn: "7d",
  });

  return {
    accessToken,
    refreshToken,
  };
};

export default createSession;
