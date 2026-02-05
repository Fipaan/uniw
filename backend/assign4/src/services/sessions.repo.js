const { getDb } = require("../config/mongo");

function sessionsCol() {
    return getDb().collection("sessions");
}

async function createSession(doc) {
    const res = await sessionsCol().insertOne(doc);
    return { ...doc, _id: res.insertedId };
}

async function findSessionByJti(jti) {
    return sessionsCol().findOne({ jti });
}

async function deleteSessionByJti(jti) {
    const res = await sessionsCol().deleteOne({ jti });
    return res.deletedCount === 1;
}

module.exports = { createSession, findSessionByJti, deleteSessionByJti };
