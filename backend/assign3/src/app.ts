import express, { Request, Response, NextFunction, RequestHandler } from "express"
import fs from "fs"
import path, { dirname } from "path"
import { fileURLToPath } from "url"
import mongoose from "mongoose"
import cookieParser from "cookie-parser"
import log from "./middleware/log.js"
import register from "./router/register.js"
import login from "./router/login.js"
import profile from "./router/profile.js"
import tasks from "./router/tasks.js"
import utils from "./utils/index.js"
import { GenericError, InternalServerError } from "./utils/error.js"

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const INDEX_PATH = path.join(__dirname, "..", "public", "index.html")
const port: number = 3000
const app = express()

app.use(express.urlencoded({ extended: true }))
app.use(express.static(path.join(__dirname, "..", "public")))
app.use(express.json())

let exiting = false
async function terminate(reloading: boolean): Promise<void> {
    if (exiting) return
    exiting = true
    utils.INFO(reloading ? "reloading..." : "exiting...")
    try {
        await mongoose.disconnect()
        utils.INFO("Successfully disconnected MongoDB")
    } catch (err) {
        utils.ERROR(`Couldn't disconnect MongoDB: ${err}`)
    }
}

process.on("SIGTERM", async function() {
    await terminate(true)
    process.exit(1)
})
process.on("SIGINT", async function() {
    await terminate(false)
    process.exit(1)
})

app.use("/",             log.reqs)
app.use("/",             cookieParser())
app.use("/api/register", register)
app.use("/api/login",    login)
app.use("/api/profile",  profile)
app.use("/api/tasks",    tasks)

app.get('/', (req: Request, res: Response) => {
    res.sendFile(INDEX_PATH)
})

app.use((err: unknown, req: Request, res: Response, next: NextFunction) => {
    let status: number = 500
    let name:   string = "UnknownError"
    let error:  string = "unknown error"
    if (err instanceof Error) {
        error = err.message
        if (err instanceof Error && err.name) {
            name = err.name
        }
        if (err instanceof GenericError) {
            status = err.status
        }
    }
    if (status === 500) utils.ERROR(`${name}(${status}): ${error}`)
    return res.status(status).json({ name, error })
})

const server = app.listen(port, async () => {
    utils.INFO(`Todo Website listening on port ${port}`)
 
    try {
        const pass: string | undefined = process.env.MONGODB_PASS
        if (pass === undefined)
            throw new InternalServerError("MONGODB_PASS is not set")
        await mongoose.connect(`mongodb+srv://${process.env.MONGODB_USER}:${encodeURIComponent(pass)}@cluster0.7tnosi5.mongodb.net/?appName=Cluster0`)
        utils.INFO("Successfully connected to MongoDB")
    } catch (err) {
        utils.ERROR(`Couldn't connect MongoDB: ${err}`)
        process.exit(1)
    }
})

server.on("error", (err: NodeJS.ErrnoException) => {
    utils.ERROR(err.message)
    process.exit(1)
})
