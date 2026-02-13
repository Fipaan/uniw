import type { Request, Response } from "express";
import { User } from "../models/User.js";
import {
    BadRequestError,
    UnauthorizedError,
    NotFoundError,
} from "../utils/error.js";
import { isObjectId } from "../utils/basic.js";

export default {
    get: async (req: Request, res: Response) => {
        const userId = req.user?.sub;
        if (!userId) throw new UnauthorizedError("Unauthorized");
    
        const user = await User.findById(userId).select("username email role createdAt").lean();
        if (!user) throw new NotFoundError("User not found");
    
        return res.json({ id: String(user._id), ...user });
    },
    
    update: async (req: Request, res: Response) => {
        const userId = req.user?.sub;
        if (!userId) throw new UnauthorizedError("Unauthorized");
    
        const { username, email } = req.body as { username?: string; email?: string };
    
        if (email) {
            const used = await User.findOne({ email, _id: { $ne: userId } }).lean();
            if (used) throw new BadRequestError("Email already in use");
        }
    
        const updated = await User.findByIdAndUpdate(
            userId,
            { ...(username ? { username } : {}), ...(email ? { email } : {}) },
            { new: true }
        ).select("username email role createdAt");
    
        if (!updated) throw new NotFoundError("User not found");
    
        return res.json({ status: "OK", user: { id: String(updated._id), username: updated.username, email: updated.email, role: updated.role } });
    },
}
