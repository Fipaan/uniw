import mongoose, { Schema, type InferSchemaType } from "mongoose";
import { toEnumSafe } from "../utils/basic.js";

export enum UserRole {
    User  = "user",
    Admin = "admin",
}

export function getUserRole(role: string): UserRole | undefined {
    if (Object.values(UserRole).includes(role as UserRole)) {
        return role as UserRole;
    }
    return undefined;
}

const userSchema = new Schema(
  {
    username: {
        type: String,
        required: true,
        trim: true,
        minlength: 3,
        maxlength: 32,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
    },
    passwordHash: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        enum: Object.values(UserRole),
        default: UserRole.User,
    },
  },
  { timestamps: true }
);

export type UserDoc = InferSchemaType<typeof userSchema> & { _id: mongoose.Types.ObjectId };

export const User = mongoose.model("User", userSchema);
