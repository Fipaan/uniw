import { Request, Response, NextFunction } from "express"
import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"
import { ConflictError, UnauthorizedError, InternalServerError } from "../utils/error.js"
import utils from "../utils/index.js"
import { UserDocument, User, findUser } from "../data/index.js"

const ACCESS_TOKEN_TTL_SECS  = 15 * 60
const ACCESS_TOKEN_TTL_MSECS = ACCESS_TOKEN_TTL_SECS * 1000

function generateAccessToken(user: User): string {
    return jwt.sign(
        {
            username: user.username,
            email: user.email,
        },
        process.env.JWT_SECRET as string,
        { expiresIn: ACCESS_TOKEN_TTL_SECS }
    )
}

export const login_post = async (
    req: Request, res: Response, next: NextFunction
): Promise<Response> => {
    type Body = {
        email?: string
        username?: string
        pass: string
    }
    const { email, username, pass }: Body = req.body

    const user: UserDocument = await findUser(username, email)
    if (!(await bcrypt.compare(pass, user.pass)))
        throw new UnauthorizedError("invalid password")

    const token = generateAccessToken(user)
    res.cookie("access_token", token, {
        httpOnly: true,
        secure: true, // HTTPS only
        sameSite: "strict",
        maxAge: ACCESS_TOKEN_TTL_MSECS,
        path: "/",
    })

    return res.status(200).json({ message: "successfully logged in" })
}
