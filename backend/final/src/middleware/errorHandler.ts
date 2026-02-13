import type { Request, Response, NextFunction } from "express";
import log from "../utils/log.js";
import { GenericError } from "../utils/error.js";

export function errorHandler(err: unknown, _req: Request, res: Response, next: NextFunction) {
    let status = 500;
    let name   = "UnknownError";
    let error  = "unknown error";
    if (err instanceof Error) {
        error = err.message;
        if (err instanceof Error && err.name) {
            name = err.name;
        }
        if (err instanceof GenericError) {
            status = err.status;
        }
    }
    if (status === 500) {
        if (err?.stack) log.ERROR(err.stack);
        else log.ERROR(`${name}(${status}):`, error);
    }
    return res.status(status).json({ name, error });
}
