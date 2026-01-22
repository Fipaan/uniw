import { Request, Response, NextFunction } from "express"
import { Types } from "mongoose"
import { BadRequestError, NotFoundError, InternalServerError } from "../utils/error.js"
import { UserDocument, reqUser, Task, TaskDocument,
         parseTitle, parseDesc, parseDone } from "../data/index.js"

export const task_post = async (
    req: Request, res: Response, next: NextFunction
): Promise<Response> => {
    const { id } = req.params as { id?: string }
    if (id === undefined) throw new BadRequestError("missing task id")
    if (!Types.ObjectId.isValid(id)) throw new BadRequestError("invalid task id")

    type BodyRaw = {
        title?: unknown;
        desc?:  unknown;
        done?:  unknown;
    }
    const _body: BodyRaw | undefined = req.body as BodyRaw | undefined
    if (_body === undefined) throw new BadRequestError("missing body")
    if ((_body.title ?? _body.desc ?? _body.done) === undefined)
        throw new BadRequestError("expected at least one field to modify")
    type UpdateTaskDto = Partial<Pick<Task, "title" | "desc" | "done">>
    const task = await Task.findByIdAndUpdate(id, { $set: {
            title: parseTitle(_body.title),
            desc:  parseDesc(_body.desc),
            done:  parseDone(_body.done),
        }},
        {
            new: true,
            runValidators: true,
        }
    )
    return res.status(201).json({
        changed: {
            title: _body.title === undefined,
            desc:  _body.desc  === undefined,
            done:  _body.done  === undefined,
        },
    })
}

export const task_delete = async (
    req: Request, res: Response, next: NextFunction
): Promise<Response> => {
    const { id } = req.params as { id?: string }
    if (id === undefined) throw new BadRequestError("missing task id")
    if (!Types.ObjectId.isValid(id)) throw new BadRequestError("invalid task id")
    
    const user: UserDocument = await reqUser(req);
    const deleted = await Task.findOneAndDelete({
        _id: new Types.ObjectId(id),
        userId: user._id,
    }).exec()
    
    if (!deleted) throw new NotFoundError("task not found");
    return res.status(204).send()
}
