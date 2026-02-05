const { UnauthorizedError, RestrictedError } = require("../utils/errors");
const { verifyAccess } = require("../services/tokens");
const { findById } = require("../services/users.repo");
const { toObjectId } = require("../utils/id");

async function requireAuth(req, res, next) {
    try {
        const header = req.headers.authorization || "";
        const bearer = header.startsWith("Bearer ") ? header.slice(7) : null;
        const cookieToken = req.cookies?.access_token || null;
        const token = bearer || cookieToken;

        if (!token) throw new UnauthorizedError("Unauthorized");

        const payload = verifyAccess(token);

        const userId = toObjectId(payload.sub);
        const user = await findById(userId);
        if (!user) throw new UnauthorizedError("Unauthorized");

        req.user = { _id: user._id, username: user.username, role: user.role };
        next();
    } catch (e) {
        return next(e instanceof Error ? e : new Error(String(e)));
    }
}

function requireRole(...roles) {
    return (req, res, next) => {
        if (!req.user) throw new UnauthorizedError("Unauthorized");
        if (!roles.includes(req.user.role)) throw new RestrictedError("Forbidden");
        next();
    };
}

module.exports = { requireAuth, requireRole };
