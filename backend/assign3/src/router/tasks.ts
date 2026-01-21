import express from "express"
import auth from "../middleware/auth.js"
import jwt from "../middleware/jwt.js"
import * as tasksController from "../controller/tasksController.js"

const router = express.Router()

router.use("/", jwt.check)
router.get("/", tasksController.tasks_get)
router.post("/", tasksController.tasks_post)

router.delete("/:id", tasksController.tasks_delete)

export default router
