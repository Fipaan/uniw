const { GenericError } = require("../utils/errors");
const utils = require("../utils/index.js")

function errorHandler(err, req, res, next) {
    let status = 500;
    let name = "UnknownError";
    let isInternal = true;
    let message = "unknown error";
    if (err instanceof Error) {
        message = err.message;
        if (err.name) {
            name = err.name;
        }
        if (err instanceof GenericError) {
            isInternal = false;
            status = err.status;
        }
    }
    if (status === 500)
        utils.ERROR(`${name}(${status}): ${message}`);
    // avoid leaking internal errors
    if (isInternal) message = "internal error";
    return res.status(status).json({ name, message });
}

module.exports = { errorHandler };
