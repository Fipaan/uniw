import mongoose, { Query, Schema, model, HydratedDocument, Types } from "mongoose"
import { Request } from "express"
import bcrypt from "bcrypt"
import utils from "../utils/index.js"
import { InternalServerError, ConflictError, BadRequestError } from "../utils/error.js"
const saltRounds: number = 10

export async function encryptPass(pass: string) {
    const salt = await bcrypt.genSalt(saltRounds)
    return await bcrypt.hash(pass, salt)
}

export interface User {
    full_name: string
    email?: string
    username?: string
    pass: string
}
export type UserDocument = HydratedDocument<User>

export const userSchema = new Schema<User>({
    full_name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: function(): boolean {
            return !this.username
        },
    },
    username: {
        type: String,
        required: function(): boolean {
            return !this.email
        },
    },
    pass: {
        type: String,
        required: true,
    },
})

export const User = model<User>("User", userSchema)

export function basicQuery(): Query<UserDocument[], UserDocument> {
    const query = User.find()
    query.setOptions({ lean : true })
    // NOTE: official reference uses this, but it does not exist
    // Got from: https://mongoosejs.com/docs/api/query.html#Query()
    // query.collection(User.collection) 
    return query
}

export async function findUser(username?: string, email?: string): Promise<UserDocument> {
    if (username === undefined && email === undefined)
        throw new InternalServerError("username and email are empty")
    
    const query = basicQuery()
    if (email    !== undefined) query.where("email").equals(email)
    if (username !== undefined) query.where("username").equals(username)
    const users: UserDocument[] = await query.exec()
    if (users.length === 0) throw new ConflictError("user does not exist")
    if (users.length > 1) {
        utils.ERROR("users are not unique!")
        if (email    !== undefined) utils.INFO(`Email:    ${email   }`)
        if (username !== undefined) utils.INFO(`Username: ${username}`)
    }
    return users[0]
}
export async function reqUser(req: Request): Promise<UserDocument> {
    return findUser(req.cookies["username"], req.cookies["email"])
}

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
    if (desc.length === 0) throw new BadRequestError("`desc` is empty")
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
