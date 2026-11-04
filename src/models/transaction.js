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
    balanceAfter: { type: Number, min: 0 },
  },
  { timestamps: true, versionKey: false },
);

transactionSchema.index({ userId: 1, date: -1 });
transactionSchema.post("save", handleMongooseError);

const createTransactionSchema = Joi.object({
  type: Joi.string().valid("income", "expense").required(),
  category: Joi.string().required().messages({
    "any.required": "Обов'язкове поле",
  }),
  amount: Joi.number().min(0.01).precision(2).strict().required().messages({
    "number.base": "Сума повинна бути числом",
    "number.min": "Сума повинна бути не менше 0.01",
    "number.precision": "Сума повинна мати не більше 2 знаків після коми",
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
