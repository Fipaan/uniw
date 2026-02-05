const jwt = require("jsonwebtoken");
const { v4: uuidv4 } = require("uuid");
const { env } = require("../config/env");

function signAccessToken(user) {
    return jwt.sign(
        { sub: String(user._id), role: user.role, username: user.username },
        env.jwtAccessSecret,
        { expiresIn: `${env.accessTtlMin}m` }
    );
}

function signRefreshToken(user) {
    const jti = uuidv4();
    const token = jwt.sign(
        { sub: String(user._id), jti },
        env.jwtRefreshSecret,
        { expiresIn: `${env.refreshTtlDays}d` }
    );
    return { token, jti };
}

function verifyAccess(token) {
    return jwt.verify(token, env.jwtAccessSecret);
}

function verifyRefresh(token) {
    return jwt.verify(token, env.jwtRefreshSecret);
}

module.exports = { signAccessToken, signRefreshToken, verifyAccess, verifyRefresh };
