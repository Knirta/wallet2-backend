import { Schema, model } from "mongoose";
import { REFRESH_DURATION_SEC } from "../constants/index.js";

import { handleMongooseError } from "../helpers/index.js";

const sessionSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    accessToken: { type: String, required: true },
    refreshToken: { type: String, required: true },
  },
  { timestamps: true, versionKey: false },
);

sessionSchema.index(
  { createdAt: 1 },
  { expireAfterSeconds: REFRESH_DURATION_SEC },
);
sessionSchema.post("save", handleMongooseError);

export const Session = model("session", sessionSchema);
