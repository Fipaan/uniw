import mongoose, { Schema, type InferSchemaType } from "mongoose";

const taskSchema = new Schema(
  {
    ownerId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    title: { type: String, required: true, trim: true, maxlength: 120 },
    description: { type: String, default: "", maxlength: 2000 },
    status: { type: String, enum: ["todo", "in_progress", "done"], default: "todo", index: true },
    dueDate: { type: Date, default: null },
    projectId: { type: Schema.Types.ObjectId, ref: "Project", default: null, index: true },
    tagIds: [{ type: Schema.Types.ObjectId, ref: "Tag" }],
  },
  { timestamps: true }
);

export type TaskDoc = InferSchemaType<typeof taskSchema> & { _id: mongoose.Types.ObjectId };

export const Task = mongoose.model("Task", taskSchema);
