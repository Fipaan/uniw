import express from "express"
import auth from "../middleware/auth.js"
import jwt from "../middleware/jwt.js"
import * as tasksController from "../controller/tasksController.js"
import * as taskController from "../controller/taskController.js"

const router = express.Router()

router.use("/", jwt.check)
router.get("/",  tasksController.tasks_get)
router.post("/", tasksController.tasks_post)

router.post("/:id",   taskController.task_post)
router.delete("/:id", taskController.task_delete)

export default router
