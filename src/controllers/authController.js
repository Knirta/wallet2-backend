import { registerUser } from "../services/auth.js";
import { ctrlWrapper } from "../helpers/index.js";
import { HttpError } from "../helpers/index.js";
import { User } from "../models/user.js";

const register = async (req, res) => {
  const newUser = await registerUser(req.body);
  res.status(201).json({
    status: "success",
    code: 201,
    message: "User registered successfully",
    data: {
      username: newUser.username,
      email: newUser.email,
    },
  });
};

const verifyEmail = async (req, res) => {
  const { verificationCode } = req.params;
  const user = await User.findOne({ verificationCode });

  if (!user) {
    throw HttpError(404, "User not found");
  }

  user.isVerified = true;
  user.verificationCode = null;
  await user.save();

  res.json({
    status: "success",
    message: "Email verified successfully",
  });
};

export default {
  register: ctrlWrapper(register),
  verifyEmail: ctrlWrapper(verifyEmail),
};
