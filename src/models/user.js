import { Schema, model } from "mongoose";
import Joi from "joi";
import { handleMongooseError } from "../helpers/index.js";

const emailRegexp = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,})+$/;

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      minLength: [2, "Name is too short"],
      maxLength: [30, "Name is too long"],
    },
    email: {
      type: String,
      unique: true,
      match: emailRegexp,
      trim: true,
      lowercase: true,
      required: [true, "Email is required"],
    },
    password: {
      type: String,
      minLength: [6, "Password is too short"],
      required: [true, "Password is required"],
    },
    currency: { type: String, enum: ["UAH", "USD", "EUR"], default: "UAH" },
    totalBalance: { type: Number, default: 0 },
  },
  { timestamps: true, versionKey: false },
);

userSchema.post("save", handleMongooseError);

const registerSchema = Joi.object({
  name: Joi.string().min(2).max(30).required(),
  email: Joi.string().pattern(emailRegexp).required(),
  password: Joi.string().min(6).required(),
});

const loginSchema = Joi.object({
  email: Joi.string().pattern(emailRegexp).required(),
  password: Joi.string().min(6).required(),
});

const schemas = {
  registerSchema,
  loginSchema,
};

const User = model("user", userSchema);

export { User, schemas };
