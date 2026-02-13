import mongoose, { Schema, type InferSchemaType } from "mongoose";

const tagSchema = new Schema(
  {
    ownerId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    name: { type: String, required: true, trim: true, maxlength: 32 },
    color: { type: String, default: "#6c757d" } // bootstrap-ish gray by default
  },
  { timestamps: true }
);

export type TagDoc = InferSchemaType<typeof tagSchema> & { _id: mongoose.Types.ObjectId };

export const Tag = mongoose.model("Tag", tagSchema);
