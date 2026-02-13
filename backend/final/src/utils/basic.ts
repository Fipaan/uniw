import type { Request, Response, NextFunction } from "express";
import bcrypt from "bcrypt"
import mongoose from "mongoose"

const saltRounds: number = 10

export type MiddlewareType = (req: Request, res: Response, next: NextFunction) => void;

export async function encryptPass(pass: string) {
    const salt = await bcrypt.genSalt(saltRounds)
    return await bcrypt.hash(pass, salt)
}

export function isObjectId(id: string) {
    return mongoose.Types.ObjectId.isValid(id);
}

export function toEnumSafe<T>(val: any, enumObj: T): T[keyof T] | undefined {
    if (val in enumObj) {
        return enumObj[val as keyof T];
    }
    return undefined;
}
