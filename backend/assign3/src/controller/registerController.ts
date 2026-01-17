import { Request, Response, NextFunction } from "express"

export const register_post = async (
    req: Request, res: Response, next: NextFunction
): Promise<Response> => {
    return res.status(400).json({
        error: "POST /register is not implemented"
    })
}
