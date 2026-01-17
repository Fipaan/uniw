import express from "express"
import valid from "../middleware/valid"
import * as registerController from "../controller/registerController"

const router = express.Router()

router.use("/", valid.reg)
router.post("/", registerController.register_post)

export default router
