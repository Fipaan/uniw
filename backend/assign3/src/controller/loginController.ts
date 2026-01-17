import { Request, Response, NextFunction } from "express"

export const login_post = async (
    req: Request, res: Response, next: NextFunction
): Promise<Response> => {
    return res.status(400).json({
        error: "POST /login is not implemented"
    })
}
