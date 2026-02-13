import Joi from "joi";
import { wrapSchema } from "./basic.ts";

const taskObj = {
    title: Joi.string().max(120),
    description: Joi.string().max(2000).allow("").optional(),
    status: Joi.string().valid("todo", "in_progress", "done").optional(),
    dueDate: Joi.date().iso().allow(null).optional(),
    projectId: Joi.string().hex().length(24).allow(null).optional(),
    tagIds: Joi.array().items(Joi.string().hex().length(24)).optional(),
}

export default {
    create: wrapSchema(taskObj, {
        obj: (obj) => { obj.title = obj.title.required(); return obj },
    }),

    update: wrapSchema(taskObj, {
        obj: (obj) => { obj.title = obj.title.optional(); return obj },
        schema: (schema) => schema.min(1),
    }),
}
