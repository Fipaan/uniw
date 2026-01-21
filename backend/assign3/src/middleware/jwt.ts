import { Request, Response, NextFunction } from "express"
import jwt from "jsonwebtoken"
import { InternalServerError, UnauthorizedError } from "../utils/error.js"

export default {
    check(req: Request, res: Response, next: NextFunction): void | Response {
        const token = req.cookies["access_token"] ?? undefined;
        if (token === undefined)
            throw new UnauthorizedError("token is missing")

        try {
            const _decoded: unknown = jwt.verify(token, process.env.JWT_SECRET as string)
            type CookieData = {
                username?: string;
                email?:    string;
            }
            const decoded: CookieData = _decoded as CookieData
            if (decoded.username !== undefined)
                req.cookies["username"] = decoded.username
            else if (decoded.email !== undefined)
                req.cookies["email"] = decoded.email
            else
                throw new InternalServerError("token is invalid")
        } catch (err) {
            throw new UnauthorizedError("invalid or expired token")
        }
        
        next()
    }
}
