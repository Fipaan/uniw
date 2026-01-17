const express = require("express")
const loginController = require("../controller/loginController")
const router = express.Router()

router.post("/", loginController.login_post)

module.exports = router
