const { InternalError } = require("../utils/errors");
const dotenv = require("dotenv");
dotenv.config();

function required(name) {
    const v = process.env[name];
    if (!v) {
        throw new InternalError(`Missing required env var: ${name}`);
    }
    return v;
}

const env = {
    nodeEnv: process.env.NODE_ENV || "development",
    port: Number(process.env.PORT || 3000),

    mongoUri: required("MONGO_URI"),
    mongoDb: required("MONGO_DB"),

    jwtAccessSecret: required("JWT_ACCESS_SECRET"),
    jwtRefreshSecret: required("JWT_REFRESH_SECRET"),

    accessTtlMin: Number(process.env.ACCESS_TOKEN_TTL_MIN || 30),
    refreshTtlDays: Number(process.env.REFRESH_TOKEN_TTL_DAYS || 30),

    cookieSecure: String(process.env.COOKIE_SECURE || "false") === "true",
    cookieSameSite: process.env.COOKIE_SAMESITE || "lax",

    adminUsernames: (process.env.ADMIN_USERNAMES || "")
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
};

module.exports = { env };
