import Joi from "joi";
import { wrapSchema } from "./basic.ts";

const projectObj = {
    name: Joi.string().max(80),
    description: Joi.string().max(500).allow("").optional(),
}

export default {
    create: wrapSchema(projectObj, {
        obj: (obj) => { obj.name = obj.name.required(); return obj },
    }),
    update: wrapSchema(projectObj, {
        obj: (obj) => { obj.name = obj.name.optional(); return obj },
        schema: (schema) => schema.min(1),
    }),
}
