import express from "express"
import valid from "../middleware/valid.js"
import * as registerController from "../controller/registerController.js"

const router = express.Router()

router.use("/", valid.check)
router.post("/", registerController.register_post)

export default router
