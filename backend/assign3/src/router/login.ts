import express from "express"
import * as loginController from "../controller/loginController"

const router = express.Router()

router.post("/", loginController.login_post)

export default router
