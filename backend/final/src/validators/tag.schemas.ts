import Joi from "joi";
import { wrapSchema } from "./basic.ts";

export default {
    create: wrapSchema({
        name: Joi.string().max(32).required(),
        color: Joi.string().max(20).optional(),
    }),
    update: wrapSchema({
        name: Joi.string().max(32).optional(),
        color: Joi.string().max(20).optional(),
    }, {
        schema: (schema) => schema.min(1),
    }),
}
