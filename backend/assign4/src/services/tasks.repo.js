const { getDb } = require("../config/mongo");

function tasksCol() {
    return getDb().collection("tasks");
}

async function createTask(doc) {
    const res = await tasksCol().insertOne(doc);
    return { ...doc, _id: res.insertedId };
}

async function findTaskById(_id) {
    return tasksCol().findOne({ _id });
}

async function findTasksByOwner(ownerId) {
    return tasksCol().find({ ownerId }).sort({ createdAt: -1 }).toArray();
}

async function updateTaskStatus(_id, status) {
    const now = new Date();
    const res = await tasksCol().findOneAndUpdate(
        { _id },
        { $set: { status, updatedAt: now } },
        { returnDocument: "after" }
    );
    return res.value;
}

async function deleteTask(_id) {
    const res = await tasksCol().deleteOne({ _id });
    return res.deletedCount === 1;
}

module.exports = { createTask, findTaskById, findTasksByOwner, updateTaskStatus, deleteTask };
