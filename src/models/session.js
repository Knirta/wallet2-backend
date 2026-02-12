import { Schema, model } from "mongoose";

import { handleMongooseError } from "../helpers/index.js";

const sessionSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "user" },
    accessToken: { type: String, required: true },
    refreshToken: { type: String, required: true },
    accessTokenValidUntil: { type: Date, required: true },
    refreshTokenValidUntil: { type: Date, required: true },
  },
  { timestamps: true, versionKey: false },
);

sessionSchema.post("save", handleMongooseError);

export const Session = model("session", sessionSchema);
