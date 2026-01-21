import { Request, Response, NextFunction } from "express"
import { BadRequestError } from "../utils/error.js"
import { verifyEmail, verifyUsername, verifyPass } from "./impl.js"

export default {
    check(req: Request, res: Response, next: NextFunction): void | Response {
        if (req.body === undefined)
            throw new BadRequestError("body is missing")
        const {email, username, pass} = req.body
        if (email === undefined && username === undefined)
            throw new BadRequestError("email/username is missing")
        verifyEmail(email)
        verifyUsername(username)
        verifyPass(pass)
        
        next()
    }
}
