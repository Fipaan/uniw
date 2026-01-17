const fs    = require("fs")
const path  = require("path")
const utils = require("../utils/index")
const LOG_FILE = path.join(__dirname, "..", "..", "server.log")

module.exports = {
    reqs(req, res, next) {
        const t = new Date().toISOString()
        let ip = req.ip
        if (ip.startsWith('::ffff:')) {
            ip = ip.substring(7)
        }
        const msg = utils.LOG_S(`[${t}] ${ip}: ${req.method}: ${req.url}`)
        fs.appendFileSync(LOG_FILE, msg + "\r\n");
        console.log(msg)
        next()
    }
}
