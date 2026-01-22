import { Request, Response, NextFunction } from "express"
import { BadRequestError } from "../utils/error.js"
import { verifyFullName, verifyEmail, verifyUsername, verifyPass } from "./impl.js"

export default {
    check(req: Request, res: Response, next: NextFunction): void | Response {
        if (req.body === undefined)
            throw new BadRequestError("Body is missing")
        const {full_name, email, username, pass} = req.body
        verifyFullName(full_name)
        if (email === undefined && username === undefined)
            throw new BadRequestError("Email and username are missing")
        verifyEmail(email)
        verifyUsername(username)
        verifyPass(pass)
        
        next()
    }
}
