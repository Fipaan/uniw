import express, { Request, Response, NextFunction } from "express"
import fs from "fs"
import path from "path"
import log from "./middleware/log"
import register from "./router/register"
import login from "./router/login"
import utils from "./utils/index"

const INDEX_PATH = path.join(__dirname, "public", "index.html")
const port: number = 3000
const app = express()

app.use(express.urlencoded({ extended: true }))
app.use(express.static(path.join(__dirname, "public")))
app.use(express.json())

let exiting = false
function terminate(reloading: boolean): void {
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

app.get('/', (req: Request, res: Response) => {
    res.sendFile(INDEX_PATH)
})

const server = app.listen(port, () => {
    utils.INFO(`Todo Website listening on port ${port}`)
})

server.on("error", (err: NodeJS.ErrnoException) => {
    utils.ERROR(err.message)
    process.exit(1)
})
