import type { Request, Response } from "express";
import { User, getUserRole } from "../models/User.js";
import { Task } from "../models/Task.js";
import { BadRequestError } from "../utils/error.js";
import { isObjectId } from "../utils/basic.js";

export default {
    listUsers: async (req: Request, res: Response) => {
        const { q, roleVal } = req.query as { q?: string; role?: string };

        const filter: Record<string, unknown> = {};

        if (roleVal) {
            const role = getUserRole(roleVal);
            if (!role) throw new BadRequestError("Invalid role filter");
            filter.role = role;
        }

        if (q) {
            const rx = { $regex: q, $options: "i" };
            filter.$or = [{ username: rx }, { email: rx }];
        }

        const users = await User.find(filter)
            .select("username email role createdAt")
            .sort({ createdAt: -1 })
            .lean();

        return res.json(users.map((u) => ({ id: String(u._id), ...u })));
    },

    listTasks: async (req: Request, res: Response) => {
        const { status, projectId, ownerId, q } = req.query as {
            status?: string;
            projectId?: string;
            ownerId?: string;
            q?: string;
        };

        const filter: Record<string, unknown> = {};

        if (status) filter.status = status;
        if (projectId) {
            if (!isObjectId(projectId)) throw new BadRequestError("Invalid projectId");
            filter.projectId = projectId;
        }
        if (ownerId) {
            if (!isObjectId(ownerId)) throw new BadRequestError("Invalid ownerId");
            filter.ownerId = ownerId;
        }
        if (q) filter.title = { $regex: q, $options: "i" };

        const tasks = await Task.find(filter).sort({ createdAt: -1 }).lean();
        return res.json(tasks);
    },
};
