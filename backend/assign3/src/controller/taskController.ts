import { Request, Response, NextFunction } from "express"
import { Types } from "mongoose"
import { BadRequestError, NotFoundError, InternalServerError, RestrictedError } from "../utils/error.js"
import { parseTitle, parseDesc, parseDone } from "../data/index.js"
import { reqUser } from "../models/user.js"
import { Task } from "../models/task.js"

function getId(req: Request): string {
    const { id } = req.params as { id?: string }
    if (id === undefined) throw new BadRequestError("Missing task id")
    if (!Types.ObjectId.isValid(id)) throw new BadRequestError("Invalid task id")
    return id
}

export const task_post = async (
    req: Request, res: Response, next: NextFunction
): Promise<Response> => {
    const id = getId(req)
    const user = await reqUser(req)
    type BodyRaw = {
        title?: unknown;
        desc?:  unknown;
        done?:  unknown;
    }
    const _body: BodyRaw | undefined = req.body as BodyRaw | undefined
    if (_body === undefined) throw new BadRequestError("Missing body")
    if ((_body.title ?? _body.desc ?? _body.done) === undefined)
        throw new BadRequestError("Expected at least one field to modify")

    const task = await Task.findById(id)
    if (task === null) throw new NotFoundError("Task not found")
    if (!task.userId.equals(user._id)) throw new RestrictedError("You do not own this task")
    
    task.title = parseTitle(_body.title) ?? task.title
    task.desc  = parseDesc(_body.desc)   ?? task.desc
    task.done  = parseDone(_body.done)   ?? task.done
    await task.save()

    return res.status(201).json({
        changed: {
            title: _body.title !== undefined,
            desc:  _body.desc  !== undefined,
            done:  _body.done  !== undefined,
        },
    })
}

export const task_delete = async (
    req: Request, res: Response, next: NextFunction
): Promise<Response> => {
    const id = getId(req)
    const user = await reqUser(req);
    const deleted = await Task.findOneAndDelete({
        _id: new Types.ObjectId(id),
        userId: user._id,
    }).exec()
    
    if (!deleted) throw new NotFoundError("task not found");
    return res.status(204).send()
}
