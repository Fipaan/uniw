class GenericError extends Error {
    constructor(status, name, message) {
        super(message);
        this.status = status;
        this.name = name;
    }
}
class BadRequestError extends GenericError {
    constructor(message) {
        super(400, "BadRequestError", message);
    }
}
class UnauthorizedError extends GenericError {
    constructor(message) {
        super(401, "UnauthorizedError", message);
    }
}
class RestrictedError extends GenericError {
    constructor(message) {
        super(403, "ForbiddenError", message);
    }
}
class NotFoundError extends GenericError {
    constructor(message) {
        super(404, "NotFoundError", message);
    }
}
class ConflictError extends GenericError {
    constructor(message) {
        super(409, "ConflictError", message);
    }
}
class InternalServerError extends GenericError {
    constructor(message) {
        super(500, "InternalServerError", message);
    }
}

module.exports = {
    GenericError,
    BadRequestError,
    UnauthorizedError,
    RestrictedError,
    NotFoundError,
    ConflictError,
    InternalServerError,
};
