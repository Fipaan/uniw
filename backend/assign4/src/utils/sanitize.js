const mongoSanitize = require("mongo-sanitize");

function sanitizeBody(req, res, next) {
    if (req.body && typeof req.body === "object") {
        // remove dangerous keys (e.g. $gt, $where, ...)
        req.body = mongoSanitize(req.body);
    }
    next();
}

module.exports = { sanitizeBody };
