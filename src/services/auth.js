import bcrypt from "bcryptjs";
import gravatar from "gravatar";

import { User } from "../models/user.js";
import { HttpError } from "../helpers/index.js";

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

  return User.create({ ...payload, password: hashedPassword, avatarURL });
};

export { registerUser };
