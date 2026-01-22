import { BadRequestError } from "../utils/error.js"

export const FULL_NAME_MIN_LENGTH = 4
export function verifyFullName(full_name: unknown): void {
    if (full_name === undefined)
        throw new BadRequestError("Full name is missing")
    if (typeof full_name !== "string")
        throw new BadRequestError("Full name is not a string")
    if (full_name === "")
        throw new BadRequestError("Full name is empty")
    if (full_name.length < FULL_NAME_MIN_LENGTH)
        throw new BadRequestError("Full name is too short")
    return
}

export const emailRegex = /^[^\s@]+@[^\s@]+$/
export function verifyEmail(email: unknown): void {
    if (email === undefined) return
    if (typeof email !== "string")
        throw new BadRequestError("Email is not a string")
    if (!emailRegex.test(email))
        throw new BadRequestError("Provided email is not valid")
}

export const USERNAME_MIN_LENGTH = 6
export function verifyUsername(username: unknown): void {
    if (username === undefined) return
    if (typeof username !== "string")
        throw new BadRequestError("Username is not a string")
    if (username === "")
        throw new BadRequestError("Username is empty")
    if (username.length < USERNAME_MIN_LENGTH)
        throw new BadRequestError("Username is too short")
}

export const PASSWORD_MIN_LENGTH = 8
export const PASSWORD_MAX_LENGTH = 20
export function verifyPass(pass: unknown): void {
    if (pass === undefined)
        throw new BadRequestError("Password is missing")
    if (typeof pass !== "string")
        throw new BadRequestError("Password is not a string")
    if (pass === "")
        throw new BadRequestError("Password is empty")
    if (pass.length < PASSWORD_MIN_LENGTH)
        throw new BadRequestError("Password is too short")
    if (pass.length > PASSWORD_MAX_LENGTH)
        throw new BadRequestError("Password is too long")
}
