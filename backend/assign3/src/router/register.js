const express = require("express")
const valid   = require("../middleware/valid")
const registerController = require("../controller/registerController")
const router = express.Router()

router.use("/", valid.reg)
router.post("/", registerController.register_post)

module.exports = router
