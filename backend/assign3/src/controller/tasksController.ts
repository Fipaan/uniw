import { Request, Response, NextFunction } from "express"
import { InternalServerError } from "../utils/error.js"

export const tasks_get = async (
    req: Request, res: Response, next: NextFunction
): Promise<Response> => {
    return res.status(200).json([])
    // throw new InternalServerError("GET /tasks not implemented");
}

export const tasks_post = async (
    req: Request, res: Response, next: NextFunction
): Promise<Response> => {
    throw new InternalServerError("POST /tasks not implemented");
}

export const tasks_delete = async (
    req: Request, res: Response, next: NextFunction
): Promise<Response> => {
    throw new InternalServerError("DELETE /tasks/:id not implemented");
}
