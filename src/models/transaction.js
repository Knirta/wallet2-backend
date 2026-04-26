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
    sum: { type: Number, required: true },
    type: { type: String, enum: ["income", "expense"], required: true },
    category: { type: Schema.Types.ObjectId, ref: "category", required: true },
    date: { type: Date, required: true },
    comment: { type: String, default: "" },
  },
  { timestamps: true, versionKey: false },
);

transactionSchema.post("save", handleMongooseError);

const createTransactionSchema = Joi.object({
  sum: Joi.number().integer().positive().required().messages({
    "number.integer": "Сума повинна бути цілим числом",
    "number.positive": "Сума повинна бути додатнім числом",
    "any.required": "Сума є обов'язковою для заповнення",
  }),
  type: Joi.string().valid("income", "expense").required(),
  date: Joi.date().required(),
  comment: Joi.string().allow("").max(250).optional(),
});

const schemas = { createTransactionSchema };

const Transaction = model("transaction", transactionSchema);

export { Transaction, schemas };
