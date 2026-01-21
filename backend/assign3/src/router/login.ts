import express from "express"
import auth from "../middleware/auth.js"
import * as loginController from "../controller/loginController.js"

const router = express.Router()

router.use("/", auth.check)
router.post("/", loginController.login_post)

export default router
