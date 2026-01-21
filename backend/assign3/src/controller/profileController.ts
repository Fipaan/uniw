import { Request, Response, NextFunction } from "express"
import { InternalServerError } from "../utils/error.js"
import { UserDocument, User, findUser } from "../data/index.js"

export const profile_get = async (
    req: Request, res: Response, next: NextFunction
): Promise<Response> => {
    const user: UserDocument = await findUser(req.cookies["username"], req.cookies["email"])
    
    return res.status(200).json({
        full_name: user.full_name,
        username:  user.username,
        email:     user.email,
    })
}
