import { Request, Response, NextFunction } from "express"
import { reqUser } from "../models/user.js"

export const profile_get = async (
    req: Request, res: Response, next: NextFunction
): Promise<Response> => {
    const user = await reqUser(req)
    
    return res.status(200).json({
        full_name: user.full_name,
        username:  user.username,
        email:     user.email,
    })
}
