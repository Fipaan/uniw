import type { Request, Response } from "express";
import mongoose from "mongoose";
import { Task } from "../models/Task.js";
import {
    BadRequestError,
    UnauthorizedError,
    ForbiddenError,
    NotFoundError,
} from "../utils/error.js";
import { isObjectId } from "../utils/basic.js";

export default {
    create: async (req: Request, res: Response) => {
        const ownerId = req.user?.sub;
        if (!ownerId) throw new UnauthorizedError("Unauthorized");
    
        const doc = await Task.create({ ...req.body, ownerId });
        return res.status(201).json(doc);
    },
    
    list: async (req: Request, res: Response) => {
        const ownerId = req.user?.sub;
        if (!ownerId) throw new UnauthorizedError("Unauthorized");
    
        const { status, projectId, q } = req.query as { status?: string; projectId?: string; q?: string };
    
        const filter: Record<string, unknown> = { ownerId };
        if (status) filter.status = status;
        if (projectId && isObjectId(projectId)) filter.projectId = projectId;
        if (q) filter.title = { $regex: q, $options: "i" };
    
        const tasks = await Task.find(filter).sort({ createdAt: -1 }).lean();
        return res.json(tasks);
    },
    
    get: async (req: Request, res: Response) => {
        const userId = req.user?.sub;
        const role = req.user?.role;
        if (!userId) throw new UnauthorizedError("Unauthorized");
    
        const { id } = req.params;
        if (!isObjectId(id)) throw new BadRequestError("Invalid id");
    
        const task = await Task.findById(id).lean();
        if (!task) throw new NotFoundError("Task not found");
    
        if (role !== "admin" && String(task.ownerId) !== userId) throw new ForbiddenError("Forbidden");
    
        return res.json(task);
    },
    
    update: async (req: Request, res: Response) => {
        const userId = req.user?.sub;
        const role = req.user?.role;
        if (!userId) throw new UnauthorizedError("Unauthorized");
    
        const { id } = req.params;
        if (!isObjectId(id)) throw new BadRequestError("Invalid id");
    
        const task = await Task.findById(id);
        if (!task) throw new NotFoundError("Task not found");
    
        if (role !== "admin" && String(task.ownerId) !== userId) throw new ForbiddenError("Forbidden");
    
        Object.assign(task, req.body);
        await task.save();
    
        return res.json(task);
    },
    
    delete: async (req: Request, res: Response) => {
        const userId = req.user?.sub;
        const role = req.user?.role;
        if (!userId) throw new UnauthorizedError("Unauthorized");
    
        const { id } = req.params;
        if (!isObjectId(id)) throw new BadRequestError("Invalid id");
    
        const task = await Task.findById(id);
        if (!task) throw new NotFoundError("Task not found");
    
        if (role !== "admin" && String(task.ownerId) !== userId) throw new ForbiddenError("Forbidden");
    
        await task.deleteOne();
        return res.json({ status: "OK" });
    },
}
