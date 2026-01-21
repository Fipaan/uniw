import express from "express"
import auth from "../middleware/auth.js"
import jwt from "../middleware/jwt.js"
import * as profileController from "../controller/profileController.js"

const router = express.Router()

router.use("/", jwt.check)
router.get("/", profileController.profile_get)

export default router
