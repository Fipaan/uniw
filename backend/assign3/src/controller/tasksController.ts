import { Request, Response, NextFunction } from "express"
import { BadRequestError } from "../utils/error.js"
import { reqUser, Task,
         parseTitle, parseDesc, parseDone } from "../data/index.js"

export const tasks_get = async (
    req: Request, res: Response, next: NextFunction
): Promise<Response> => {
    const user = await reqUser(req)
    const tasks = await Task.find({ userId: user._id }).sort({ createdAt: -1 }).exec()
    
    return res.status(200).json(tasks)
}

export const tasks_post = async (
    req: Request, res: Response, next: NextFunction
): Promise<Response> => {
    type BodyRaw = {
        title?: unknown;
        desc?:  unknown;
        done?:  unknown;
    }
    const _body: BodyRaw | undefined = req.body as BodyRaw | undefined
    if (_body === undefined) throw new BadRequestError("missing body")
    if (_body.title === undefined) throw new BadRequestError("expected title")
    if (_body.done  === undefined) throw new BadRequestError("expected done")

    const user = await reqUser(req)
    const task = await Task.create({
        userId: user._id,
        title:  parseTitle(_body.title),
        desc:   parseDesc(_body.desc),
        done:   parseDone(_body.done),
    })
    return res.status(201).json(task)
}
