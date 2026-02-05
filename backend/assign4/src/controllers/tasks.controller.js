const { NotFoundError, RestrictedError } = require("../utils/errors");
const { toObjectId } = require("../utils/id");
const {
    createTask,
    findTaskById,
    findTasksByOwner,
    updateTaskStatus,
    deleteTask,
} = require("../services/tasks.repo");

function canModify(user, task) {
    return user.role === "admin" || String(task.ownerId) === String(user._id);
}

// POST /api/tasks
async function create(req, res) {
    const { title, description, category } = req.body;
    const now = new Date();

    const task = await createTask({
        ownerId: req.user._id,
        title,
        description,
        category: category || null,
        status: "pending",
        createdAt: now,
        updatedAt: now,
    });

    res.status(201).json({ status: "OK", task });
}

// GET /api/tasks
async function listMine(req, res) {
    const tasks = await findTasksByOwner(req.user._id);
    res.json({ status: "OK", tasks });
}

// GET /api/tasks/:id
async function getOne(req, res) {
    const _id = toObjectId(req.params.id);
    const task = await findTaskById(_id);
    if (!task) throw new NotFoundError("Task not found");
    res.json({ status: "OK", task });
}

// PATCH /api/tasks/:id
async function patchStatus(req, res) {
    const _id = toObjectId(req.params.id);
    const task = await findTaskById(_id);
    if (!task) throw new NotFoundError("Task not found");

    if (!canModify(req.user, task)) throw new RestrictedError("Forbidden");

    const updated = await updateTaskStatus(_id, req.body.status);
    res.json({ status: "OK", task: updated });
}

// DELETE /api/tasks/:id
async function remove(req, res) {
    const _id = toObjectId(req.params.id);
    const task = await findTaskById(_id);
    if (!task) throw new NotFoundError("Task not found");

    if (!canModify(req.user, task)) throw new RestrictedError("Forbidden");

    const ok = await deleteTask(_id);
    res.json({ status: "OK", deleted: ok });
}

module.exports = { create, listMine, getOne, patchStatus, remove };
