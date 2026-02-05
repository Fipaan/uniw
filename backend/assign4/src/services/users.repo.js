const { getDb } = require("../config/mongo");

function usersCol() {
    return getDb().collection("users");
}

async function createUser(doc) {
    const res = await usersCol().insertOne(doc);
    return { ...doc, _id: res.insertedId };
}

async function findByUsername(username) {
    return usersCol().findOne({ username });
}

async function findById(_id) {
    return usersCol().findOne({ _id });
}

module.exports = { createUser, findByUsername, findById };
