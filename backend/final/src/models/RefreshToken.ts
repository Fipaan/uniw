import mongoose, { Schema, type InferSchemaType } from "mongoose";

const refreshTokenSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    tokenHash: { type: String, required: true },
    expiresAt: { type: Date, required: true, index: true },
    revokedAt: { type: Date, default: null },
  },
  { timestamps: true }
);

// Not required by spec, but it gives you a clean "5th collection" and future-proofing (logout, etc.).
export type RefreshTokenDoc = InferSchemaType<typeof refreshTokenSchema> & { _id: mongoose.Types.ObjectId };

export const RefreshToken = mongoose.model("RefreshToken", refreshTokenSchema);
