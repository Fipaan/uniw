import mongoose, { Query, Schema, model, HydratedDocument } from "mongoose"
import bcrypt from "bcrypt"
import utils from "../utils/index.js"
import { InternalServerError, ConflictError } from "../utils/error.js"
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
