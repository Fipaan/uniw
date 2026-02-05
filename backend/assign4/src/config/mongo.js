const { MongoClient } = require("mongodb");
const { env } = require("./env");
const { InternalError } = require("../utils/errors");

let client;
let db;

async function connectMongo() {
    if (db) return db;
    client = new MongoClient(env.mongoUri, {
        maxPoolSize: 20,
    });
    await client.connect();
    db = client.db(env.mongoDb);

    await db.collection("users").createIndex({ username: 1 }, { unique: true });
    await db.collection("tasks").createIndex({ ownerId: 1, createdAt: -1 });
    await db.collection("sessions").createIndex({ expiresAt: 1 }, { expireAfterSeconds: 0 });
    await db.collection("sessions").createIndex({ userId: 1, createdAt: -1 });

    return db;
}

function getDb() {
    if (!db) throw new InternalServerError("Mongo not connected yet");
    return db;
}

async function closeMongo() {
    if (client) await client.close();
    client = undefined;
    db = undefined;
}

module.exports = { connectMongo, getDb, closeMongo };
