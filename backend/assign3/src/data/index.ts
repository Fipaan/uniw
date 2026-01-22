import bcrypt from "bcrypt"
import { BadRequestError } from "../utils/error.js"
const saltRounds: number = 10

export async function encryptPass(pass: string) {
    const salt = await bcrypt.genSalt(saltRounds)
    return await bcrypt.hash(pass, salt)
}

export function parseTitle(_title?: unknown): string | undefined {
    _title ??= undefined
    if (_title === undefined) return undefined
    if (typeof _title !== "string") throw new BadRequestError("`title` is not string")
    const title = _title.trim()
    if (title.length === 0) throw new BadRequestError("`title` is empty")
    if (title.length > 75) throw new BadRequestError("`title` is too long (max 75)")
    return title
}

export function parseDesc(_desc?: unknown): string | undefined {
    _desc ??= undefined
    if (_desc === undefined) return undefined
    if (typeof _desc !== "string") throw new BadRequestError("`desc` is not string")
    const desc = _desc.trim()
    if (desc.length === 0) return undefined
    if (desc.length > 400)
        throw new BadRequestError("`desc` is too long (max 400)")
    return desc
}

export function parseDone(_done?: unknown): boolean | undefined {
    _done ??= undefined
    if (_done === undefined) return undefined
    let done: boolean = false
    if (typeof _done === "boolean") done = _done
    else if (typeof _done === "string") done = _done === "false" ? false : true
    else throw new BadRequestError("`done` is not boolean")
    return done
}
