const bcrypt = require("bcrypt");
const { env } = require("../config/env");
const { UnauthorizedError, ConflictError } = require("../utils/errors");
const { createUser, findByUsername } = require("../services/users.repo");
const { createSession, deleteSessionByJti, findSessionByJti } = require("../services/sessions.repo");
const { signAccessToken, signRefreshToken, verifyRefresh } = require("../services/tokens");

const COOKIE_BASE = {
    httpOnly: true,
    secure: env.cookieSecure,
    sameSite: env.cookieSameSite,
    path: "/",
};

function publicUser(u) {
    return { id: String(u._id), username: u.username, role: u.role, createdAt: u.createdAt };
}

async function register(req, res) {
    const { username, password } = req.body;

    const exists = await findByUsername(username);
    if (exists) throw new ConflictError("Username already taken");

    const role = env.adminUsernames.includes(username) ? "admin" : "user";
    const passwordHash = await bcrypt.hash(password, 12);

    const now = new Date();
    const user = await createUser({
        username,
        passwordHash,
        role,
        createdAt: now,
        updatedAt: now,
    });

    res.status(201).json({ status: "OK", user: publicUser(user) });
}

async function login(req, res) {
    const { username, password } = req.body;

    const user = await findByUsername(username);
    // Generic message to prevent account enumeration:
    if (!user) throw new UnauthorizedError("Invalid credentials");

    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) throw new UnauthorizedError("Invalid credentials");

    const accessToken = signAccessToken(user);
    const { token: refreshToken, jti } = signRefreshToken(user);

    const now = new Date();
    const expiresAt = new Date(now.getTime() + env.refreshTtlDays * 24 * 60 * 60 * 1000);

    await createSession({
        userId: user._id,
        jti,
        createdAt: now,
        expiresAt,
    });

    // Cookie + also return token for Postman convenience
    res.cookie("access_token", accessToken, { ...COOKIE_BASE, maxAge: env.accessTtlMin * 60 * 1000 });
    res.cookie("refresh_token", refreshToken, { ...COOKIE_BASE, maxAge: env.refreshTtlDays * 24 * 60 * 60 * 1000 });

    res.json({ status: "OK", token: accessToken, user: publicUser(user) });
}

async function logout(req, res) {
    const refreshToken = req.cookies?.refresh_token;

    // Clear cookies regardless
    res.clearCookie("access_token", { path: "/" });
    res.clearCookie("refresh_token", { path: "/" });

    if (!refreshToken) return res.json({ status: "OK" });

    try {
        const payload = verifyRefresh(refreshToken);
        const session = await findSessionByJti(payload.jti);
        if (session) await deleteSessionByJti(payload.jti);
    } catch {
        // ignore invalid refresh token (still “logged out” on client)
    }

    return res.json({ status: "OK" });
}

// Optional helper endpoint (not required), kept internal: refresh access using refresh cookie
async function refresh(req, res) {
    const refreshToken = req.cookies?.refresh_token;
    if (!refreshToken) throw new UnauthorizedError("Unauthorized");

    const payload = verifyRefresh(refreshToken);
    const session = await findSessionByJti(payload.jti);
    if (!session) throw new UnauthorizedError("Unauthorized");

    const user = await findByUsername(req.body.username || ""); // not used; keep simple
    const { findById } = require("../services/users.repo");
    const { toObjectId } = require("../utils/id");
    const u = await findById(toObjectId(payload.sub));
    if (!u) throw new UnauthorizedError("Unauthorized");

    const accessToken = signAccessToken(u);
    res.cookie("access_token", accessToken, { ...COOKIE_BASE, maxAge: env.accessTtlMin * 60 * 1000 });
    res.json({ status: "OK", token: accessToken });
}

module.exports = { register, login, logout, refresh };
