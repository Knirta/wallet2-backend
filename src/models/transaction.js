import { Schema, model } from "mongoose";
import Joi from "joi";
import { handleMongooseError } from "../helpers/index.js";

const transactionSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "user",
      required: true,
      index: true,
    },
    type: { type: String, enum: ["income", "expense"], required: true },
    category: { type: Schema.Types.ObjectId, ref: "category", required: true },
    amount: { type: Number, required: true, min: 1 },
    date: {
      type: Date,
      required: true,
      validate: {
        validator: function (value) {
          return value <= new Date(Date.now() + 60000);
        },
        message: "Дата не може бути в майбутньому",
      },
    },
    comment: { type: String, default: "" },
  },
  { timestamps: true, versionKey: false },
);

transactionSchema.post("save", handleMongooseError);

const createTransactionSchema = Joi.object({
  type: Joi.string().valid("income", "expense").required(),
  category: Joi.string().required().messages({
    "any.required": "Обов'язкове поле",
  }),
  amount: Joi.number().integer().positive().required().messages({
    "number.integer": "Сума повинна бути цілим числом",
    "number.positive": "Сума повинна бути додатнім числом",
    "any.required": "Сума є обов'язковою для заповнення",
  }),
  date: Joi.date().max("now").required().messages({
    "date.max": "Дата не може бути в майбутньому",
    "any.required": "Обов'язкове поле",
  }),
  comment: Joi.string().allow("").max(250).optional(),
});

const schemas = { createTransactionSchema };

const Transaction = model("transaction", transactionSchema);

export { Transaction, schemas };
