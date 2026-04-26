import { Schema, model } from "mongoose";

const categorySchema = new Schema(
  {
    name: { type: String, required: true },
    type: { type: String, enum: ["income", "expense"], required: true },
    icon: { type: String, required: true },
    color: { type: String, required: true },
  },
  { timestamps: true, versionKey: false },
);

export const Category = model("category", categorySchema);
