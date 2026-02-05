const express = require("express");
const { body } = require("express-validator");
const { validate } = require("../middleware/validate");
const { requireAuth } = require("../middleware/auth");
const { create, listMine, getOne, patchStatus, remove } = require("../controllers/tasks.controller");

const router = express.Router();

router.get("/", requireAuth, listMine);
router.post(
    "/",
    requireAuth,
    body("title").isString().trim().notEmpty().isLength({ max: 200 }),
    body("description").isString().trim().notEmpty().isLength({ max: 5000 }),
    body("category").optional().isString().trim().isLength({ max: 64 }),
    validate,
    create
);

router.get("/:id", getOne);
router.delete("/:id", requireAuth, remove);
router.patch(
    "/:id",
    requireAuth,
    body("status").isIn(["pending", "completed"]),
    validate,
    patchStatus
);

module.exports = { tasksRouter: router };
