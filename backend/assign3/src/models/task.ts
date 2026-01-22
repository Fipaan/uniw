import { Schema, model, HydratedDocument, Types } from "mongoose"

export interface Task {
    userId:    Types.ObjectId
    title:     string
    desc?:     string
    done:      boolean
    createdAt: Date
    updatedAt: Date
}
export type TaskDocument = HydratedDocument<Task>

export const taskSchema = new Schema<Task>({
    userId: {
        type: Schema.Types.ObjectId,
        required: true,
        index: true,
        ref: "User",
    },
    title: {
        type: String,
        required: true,
        trim: true,
        maxlength: 75
    },
    desc: {
        type: String,
        required: false,
        trim: true,
        maxlength: 400
    },
    done: {
        type: Boolean,
        default: false
    },
}, { timestamps: true })

export const Task = model<Task>("Task", taskSchema)


