const { ObjectId } = require("mongodb");
const { BadRequestError } = require("./errors");

function toObjectId(id) {
    if (!ObjectId.isValid(id)) throw new BadRequestError("Invalid id");
    return new ObjectId(id);
}

module.exports = { toObjectId };
