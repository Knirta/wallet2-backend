import { Schema, model } from "mongoose";
import Joi from "joi";
import { handleMongooseError } from "../helpers/index.js";

const emailRegexp = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,})+$/;

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Ім'я обов'язкове до заповнення"],
      minLength: [2, "Ім'я занадто коротке"],
      maxLength: [40, "Ім'я занадто довге"],
    },
    email: {
      type: String,
      unique: true,
      match: emailRegexp,
      trim: true,
      lowercase: true,
      required: [true, "Електронна пошта обов'язкова до заповнення"],
    },
    password: {
      type: String,
      required: [true, "Пароль обов'язковий до заповнення"],
      validate: {
        validator: function (v) {
          return (
            v.length >= 8 &&
            /[A-Z]/.test(v) &&
            /[0-9]/.test(v) &&
            !/[а-яА-ЯёЁіІїЇєЄ]/.test(v)
          );
        },
        message:
          "Пароль має бути від 8 символів, містити латинську велику літеру та цифру.",
      },
    },
    avatarURL: { type: String, required: true },
    currency: { type: String, enum: ["UAH", "USD", "EUR"], default: "UAH" },
    verified: { type: Boolean, default: false },
    verificationCode: { type: String, default: "" },
    totalBalance: { type: Number, default: 0 },
  },
  { timestamps: true, versionKey: false },
);

userSchema.post("save", handleMongooseError);

const registerSchema = Joi.object({
  name: Joi.string().min(2).max(40).required(),
  email: Joi.string().pattern(emailRegexp).required(),
  password: Joi.string()
    .min(8)
    .pattern(/[A-Z]/, "одну велику літеру")
    .pattern(/[0-9]/, "одну цифру")
    .pattern(/[а-яА-ЯёЁіІїЇєЄ]/, { name: "кирилицю", invert: true })
    .required()
    .messages({
      "string.pattern.base": "Пароль повинен містити хоча б {#name}",
      "string.pattern.invert.base": "Пароль не може містити: {#name}",
      "string.min": "Пароль має бути мінімум 8 символів",
    }),
});

const verifyEmailSchema = Joi.object({
  verificationCode: Joi.string().required(),
});

const resendVerificationEmailSchema = Joi.object({
  email: Joi.string().pattern(emailRegexp).required(),
});

const loginSchema = Joi.object({
  email: Joi.string().pattern(emailRegexp).required(),
  password: Joi.string()
    .min(8)
    .pattern(/[A-Z]/, "одну велику літеру")
    .pattern(/[0-9]/, "одну цифру")
    .pattern(/[а-яА-ЯёЁіІїЇєЄ]/, { name: "кирилицю", invert: true })
    .required()
    .messages({
      "string.pattern.base": "Пароль повинен містити хоча б {#name}",
      "string.pattern.invert.base": "Пароль не може містити: {#name}",
      "string.min": "Пароль має бути мінімум 8 символів",
    }),
});

const schemas = {
  registerSchema,
  loginSchema,
  verifyEmailSchema,
  resendVerificationEmailSchema,
};

const User = model("user", userSchema);

export { User, schemas };
