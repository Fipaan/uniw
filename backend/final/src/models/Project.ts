import mongoose, { Schema, type InferSchemaType } from "mongoose";

const projectSchema = new Schema(
    {
        ownerId: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
            index: true,
        },
        name: {
            type: String,
            required: true,
            trim: true,
            maxlength: 80,
        },
        description: { type: String, default: "", maxlength: 500 },
    },
    { timestamps: true }
);

export type ProjectDoc = InferSchemaType<typeof projectSchema> & { _id: mongoose.Types.ObjectId };

export const Project = mongoose.model("Project", projectSchema);
