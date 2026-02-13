import type { Request, Response, NextFunction } from "express";
import { UserRole } from "../models/User.js";

export function requireRole(role: UserRole) {
    return (req: Request, res: Response, next: NextFunction) => {
        if (!req.user) return res.status(401).json({ message: "Unauthorized" });
        if (req.user.role !== role) return res.status(403).json({ message: "Forbidden" });
        return next();
    };
}
