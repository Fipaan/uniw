const { validationResult } = require("express-validator");
const { BadRequestError } = require("../utils/errors");

function validate(req, res, next) {
    const result = validationResult(req);
    if (!result.isEmpty()) {
        throw new BadRequestError("Couuldn't validate");
    }
    next();
}

module.exports = { validate };
