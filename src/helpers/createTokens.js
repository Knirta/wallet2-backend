import jwt from "jsonwebtoken";
import getEnvVar from "./getEnvVar.js";
import {
  ACCESS_DURATION_SEC,
  REFRESH_DURATION_SEC,
} from "../constants/index.js";

const JWT_ACCESS_SECRET = getEnvVar("JWT_ACCESS_SECRET");
const JWT_REFRESH_SECRET = getEnvVar("JWT_REFRESH_SECRET");

const createTokens = (id) => {
  const tokenPayload = {
    id,
  };

  const accessToken = jwt.sign(tokenPayload, JWT_ACCESS_SECRET, {
    expiresIn: ACCESS_DURATION_SEC,
  });
  const refreshToken = jwt.sign(tokenPayload, JWT_REFRESH_SECRET, {
    expiresIn: REFRESH_DURATION_SEC,
  });

  return {
    accessToken,
    refreshToken,
  };
};

export default createTokens;
