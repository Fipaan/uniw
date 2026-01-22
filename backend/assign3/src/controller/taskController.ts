import { Request, Response, NextFunction } from "express"
import { Types } from "mongoose"
import { BadRequestError, NotFoundError, InternalServerError } from "../utils/error.js"
import { reqUser, Task,
         parseTitle, parseDesc, parseDone } from "../data/index.js"

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
    type BodyRaw = {
        title?: unknown;
        desc?:  unknown;
        done?:  unknown;
    }
    const _body: BodyRaw | undefined = req.body as BodyRaw | undefined
    if (_body === undefined) throw new BadRequestError("Missing body")
    if ((_body.title ?? _body.desc ?? _body.done) === undefined)
        throw new BadRequestError("Expected at least one field to modify")
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
    const id = getId(req)
    const user = await reqUser(req);
    const deleted = await Task.findOneAndDelete({
        _id: new Types.ObjectId(id),
        userId: user._id,
    }).exec()
    
    if (!deleted) throw new NotFoundError("task not found");
    return res.status(204).send()
}
