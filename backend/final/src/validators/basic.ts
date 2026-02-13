import Joi from "joi";
import { validateBody } from "../middleware/validate.js";
import { MiddlewareType } from "../utils/basic.js";

// NOTE: doesn't make much sense here (because it generates middlewares),
// but at the same time it directly relates to this part of code, so
// there is no reason to jump around for one middleware generator
import type { Request, Response, NextFunction } from "express";
import type { ObjectSchema } from "joi";
import { BadRequestError } from "../utils/error.js";

function validateBody(schema: ObjectSchema) {
    return (req: Request, res: Response, next: NextFunction) => {
        const { value, error } = schema.validate(req.body, { abortEarly: false, stripUnknown: true });
        if (error) {
            const details: Record<string, string> = {};
            for (const d of error.details) {
                const key = d.path.join(".") || "body";
                details[key] = d.message;
            }
            throw new BadRequestError(`Invalid schema: ${JSON.stringify(details)}`);
        }
        req.body = value;
        return next();
    };
}

export type SchemaObj = Record<string, Joi.Schema>;

export type Validator<T extends SchemaObj> = {
    schema:    ObjectSchema<T>,
    validator: MiddlewareType,
}

type InitObj<T extends SchemaObj> = (obj: T) => T
type InitSchema<T extends SchemaObj> = (schema: ObjectSchema<T>) => ObjectSchema<T>
export function wrapSchema<T extends SchemaObj>(
    schemaObj: T,
    init?: { obj?: InitObj<T>, schema?: InitSchema<T> } = undefined
): Validator<T> {
    if (init?.obj) schemaObj = init.obj({ ...schemaObj });
    let schema = Joi.object(schemaObj);
    if (init?.schema) schema = init.schema(schema);
    return {
        schema,
        validator: validateBody(schema),
    };
}
