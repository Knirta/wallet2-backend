import { registerUser } from "../services/auth.js";
import { ctrlWrapper } from "../helpers/index.js";

const register = async (req, res) => {
  const newUser = await registerUser(req.body);
  res.status(201).json({
    status: "success",
    code: 201,
    message: "User registered successfully",
    data: {
      name: newUser.name,
      email: newUser.email,
    },
  });
};

export default {
  register: ctrlWrapper(register),
};
