const express  = require("express")
const fs       = require("fs")
const path     = require("path")
const log      = require("./middleware/log")
const register = require("./router/register")
const login    = require("./router/login")
const utils    = require("./utils/index")
const port    = 3000
const app     = express()

app.use(express.urlencoded({ extended: true }))
app.use(express.static(path.join(__dirname, "public")))
app.use(express.json())

let exiting = false
let reloading = false
function terminate(reloading) {
    if (exiting) return
    exiting = true
    utils.INFO(reloading ? "reloading..." : "exiting...")
}

process.on("SIGTERM", function() {
    terminate(true)
    process.exit(1)
})
process.on("SIGINT", function() {
    terminate(false)
    process.exit(1)
})

app.use("/",         log.reqs)
app.use("/register", register)
app.use("/login",    login)

app.get('/', (req, res) => {
  res.sendFile("/index.html")
})

const server = app.listen(port, () => {
    utils.INFO(`Todo Website listening on port ${port}`)
})

server.on("error", (err) => {
    utils.ERROR(err.message)
    process.exit(1)
})
