export class GenericError extends Error {
    status: number
    constructor(status: number, name: string, message: string) {
        super(message)
        this.status = status
        this.name = name
    }
}

export class BadRequestError extends GenericError {
    constructor(message: string) {
        super(400, "BadRequestError", message)
    }
}
export class UnauthorizedError extends GenericError {
    constructor(message: string) {
        super(401, "UnauthorizedError", message)
    }
}
export class ForbiddenError extends GenericError {
    constructor(message: string) {
        super(403, "ForbiddenError", message)
    }
}
export class NotFoundError extends GenericError {
    constructor(message: string) {
        super(404, "NotFoundError", message)
    }
}
export class ConflictError extends GenericError {
    constructor(message: string) {
        super(409, "ConflictError", message)
    }
}
export class InternalServerError extends GenericError {
    constructor(message: string) {
        super(500, "InternalServerError", message)
    }
}
