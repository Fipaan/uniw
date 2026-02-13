import Joi from "joi";
import { wrapSchema } from "./basic.ts";

const registerObj = {
    username: Joi.string().min(3).max(32).required(),
    email:    Joi.string().email().required(),
    password: Joi.string().min(8).max(128).required(),
};

const loginObj = {
    email:    Joi.string().email().required(),
    password: Joi.string().min(1).max(128).required(),
};

export default {
    register: wrapSchema(registerObj),
    login:    wrapSchema(loginObj),
}
