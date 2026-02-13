import Joi from "joi";
import { wrapSchema } from "./basic.ts";

export default {
    update: wrapSchema({
        username: Joi.string().min(3).max(32).optional(),
        email: Joi.string().email().optional(),
    }, {
        schema: (schema) => schema.min(1),
    }),
}
