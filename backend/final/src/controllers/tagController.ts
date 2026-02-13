import type { Request, Response } from "express";
import mongoose from "mongoose";
import { Tag } from "../models/Tag.js";
import {
    BadRequestError,
    UnauthorizedError,
    NotFoundError,
} from "../utils/error.js";
import { isObjectId } from "../utils/basic.js";

export default {
    create: async (req: Request, res: Response) => {
        const ownerId = req.user?.sub;
        if (!ownerId) throw new UnauthorizedError("Unathorized");
    
        const doc = await Tag.create({ ...req.body, ownerId });
        return res.status(201).json(doc);
    },
    
    list: async (req: Request, res: Response) => {
        const ownerId = req.user?.sub;
        if (!ownerId) throw new UnauthorizedError("Unathorized");
    
        const docs = await Tag.find({ ownerId }).sort({ createdAt: -1 }).lean();
        return res.json(docs);
    },
    
    get: async (req: Request, res: Response) => {
        const ownerId = req.user?.sub;
        if (!ownerId) throw new UnauthorizedError("Unathorized");
    
        const { id } = req.params;
        if (!isObjectId(id)) throw new BadRequestError("Invalid id");
    
        const doc = await Tag.findOne({ _id: id, ownerId }).lean();
        if (!doc) throw new NotFoundError("Tag not found");
    
        return res.json(doc);
    },
    
    update: async (req: Request, res: Response) => {
        const ownerId = req.user?.sub;
        if (!ownerId) throw new UnauthorizedError("Unathorized");
    
        const { id } = req.params;
        if (!isObjectId(id)) throw new BadRequestError("Invalid id");
    
        const doc = await Tag.findOneAndUpdate({ _id: id, ownerId }, req.body, { new: true }).lean();
        if (!doc) throw new NotFoundError("Tag not found");
    
        return res.json(doc);
    },
    
    delete: async (req: Request, res: Response) => {
        const ownerId = req.user?.sub;
        if (!ownerId) throw new UnauthorizedError("Unathorized");
    
        const { id } = req.params;
        if (!isObjectId(id)) throw new BadRequestError("Invalid id");
    
        const doc = await Tag.findOneAndDelete({ _id: id, ownerId }).lean();
        if (!doc) throw new NotFoundError("Tag not found");
    
        return res.json({ status: "OK" });
    },
}
