import jwt from "jsonwebtoken";
import { getEnvVar, HttpError } from "../helpers/index.js";
import { Session } from "../models/session.js";

const JWT_ACCESS_SECRET = getEnvVar("JWT_ACCESS_SECRET");

const authenticate = async (req, res, next) => {
  const { authorization = "" } = req.headers;
  const [bearer, token] = authorization.split(" ");

  if (bearer !== "Bearer" || !token) {
    return next(HttpError(401));
  }

  try {
    const { userId, sessionId } = jwt.verify(token, JWT_ACCESS_SECRET);
    const session = await Session.findOne({
      _id: sessionId,
    }).populate("userId", "-password -verificationCode -verified");

    if (!session || session.userId.id !== userId) {
      return next(HttpError(401));
    }

    req.user = session.userId;
    req.session = session;

    next();
  } catch (e) {
    console.error("Error occurred while verifying token:", e);
    next(HttpError(401));
  }
};

export default authenticate;
