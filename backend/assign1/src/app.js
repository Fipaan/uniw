const express = require("express")
const fs      = require("fs")
const path    = require("path")
const log     = require("./middleware/log")
const weather = require("./router/weather")
const utils   = require("./utils/index")
const smtp    = require("./smtp")
const data    = require("./data/index")
const port    = 3000
const app     = express()

app.use(express.urlencoded({ extended: true }))
app.use(express.static(path.join(__dirname, "public")))
app.use(express.json())

let exiting = false
function terminate() {
    if (exiting) return
    data.saveFavorites()
    data.saveUsers()
    exiting = true
}

let reloading = true
process.on("SIGTERM", function() {
    terminate()
    if (reloading) utils.INFO("reloading...")
    process.exit(1)
})
process.on("SIGINT", function() {
    reloading = false
})

app.use("/", log.reqs)
app.use("/api/weather", weather)

app.get('/', (req, res) => {
  res.sendFile("/index.html")
})

const server = app.listen(port, () => {
    utils.INFO(`Weather API listening on port ${port}`)
    data.loadFavorites()
    data.loadUsers()
})

server.on("error", (err) => {
    utils.ERROR(err.message)
    process.exit(1)
})
