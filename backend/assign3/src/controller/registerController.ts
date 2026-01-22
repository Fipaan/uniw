import { Request, Response, NextFunction } from "express"
import { ConflictError } from "../utils/error.js"
import { User, UserDocument, encryptPass, basicQuery } from "../data/index.js"

export const register_post = async (
    req: Request, res: Response, next: NextFunction
): Promise<Response> => {
    type Body = {
        full_name: string
        email?: string
        username?: string
        pass: string
    }
    const { full_name, email, username, pass }: Body = req.body

    if (email !== undefined) {
        const users = await basicQuery().where("email").equals(email).exec()
        if (users.length > 0) throw new ConflictError("User with such email already exists")
    }
    if (username !== undefined) {
        const users = await basicQuery().where("username").equals(username).exec()
        if (users.length > 0) throw new ConflictError("User with such username already exists")
    }

    const user = new User({
        full_name: full_name,
        email:     email,
        username:  username,
        pass:      await encryptPass(pass),
    });
    try {
        await user.save()
    } catch (err) {
        throw new ConflictError(`Couldn't add user: ${err}`)
    }
    
    return res.status(200).json({
        message: "user registered successfully"
    })
}
