import dotenv from "dotenv";
import { InternalServerError } from "../utils/error.js";

dotenv.config();

function req(name: string): string {
    const v = process.env[name];
    if (!v) throw new InternalServerError(`Missing required env var: ${name}`);
    return v;
}

export const ENV = {
    PORT:            Number(process.env.PORT ?? "3000"),
    MONGO_URI:       req("MONGO_URI"),
    JWT_SECRET:      req("JWT_SECRET"),
    JWT_EXPIRES_IN:  process.env.JWT_EXPIRES_IN ?? "7d",
    JWT_COOKIE_NAME: req("JWT_COOKIE_NAME"),
    CORS_ORIGIN:     process.env.CORS_ORIGIN ?? "*",
    NODE_ENV:        process.env.NODE_ENV ?? "dev",

    ADMIN_USERNAME:  req("ADMIN_USERNAME"),
    ADMIN_EMAIL:     req("ADMIN_EMAIL"),
    ADMIN_PASSWORD:  process.env.ADMIN_PASSWORD ?? "",
    ADMIN_PASS_HASH: process.env.ADMIN_PASS_HASH ?? "",
};
