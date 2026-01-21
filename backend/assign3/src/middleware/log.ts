import { Request, Response, NextFunction } from "express"
import fs from "fs"
import path, { dirname } from "path"
import { fileURLToPath } from "url"
import utils from "../utils/index.js"

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const LOG_FILE = path.join(__dirname, "..", "..", "server.log")

export default {
    reqs(req: Request, res: Response, next: NextFunction): void {
        const t = new Date().toISOString()
        let ip = req.ip ?? "unknown"
        if (typeof ip === "string" && ip.startsWith("::ffff:")) {
            ip = ip.substring(7)
        }
        const msg = utils.LOG_S(`[${t}] ${ip}: ${req.method}: ${req.url}`)
        try {
            fs.appendFileSync(LOG_FILE, msg + "\r\n")
        } catch (e) {
            console.error("Failed to append to log file:", e)
        }
        console.log(msg)
        next()
    }
}
