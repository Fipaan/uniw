import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { ENV } from "../config/env.js";
import { UserRole } from "../models/User.js";
import { UnauthorizedError } from "../utils/error.js";

export type JwtPayload = { sub: string; role: UserRole };

declare global {
    namespace Express {
        interface Request {
            user?: JwtPayload;
        }
    }
}

export function requireAuth(req: Request, res: Response, next: NextFunction) {
    const token: string | undefined = req.cookies?.[ENV.JWT_COOKIE_NAME];

    if (!token) throw new UnauthorizedError("Missing auth cookie");

    try {
        const payload = jwt.verify(token, ENV.JWT_SECRET) as JwtPayload;
        req.user = payload;
        return next();
    } catch {
        throw new UnauthorizedError("Invalid or expired token");
    }
}
