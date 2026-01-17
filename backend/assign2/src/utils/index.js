const util = require("util");

const INFO_PREFIX  = "INFO:  "
const ERROR_PREFIX = "ERROR: "

module.exports = {
    INFO_S(...args) {
        args.unshift(INFO_PREFIX)
        return util.format(...args)
    },
    INFO(...args) {
        args.unshift(INFO_PREFIX)
        console.log(...args)
    },
    ERROR_S(...args) {
        args.unshift(ERROR_PREFIX)
        return util.format(...args)
    },
    ERROR(...args) {
        args.unshift(ERROR_PREFIX)
        console.log(...args)
    },
    LOG_S(...args) {
        return util.format(...args)
    },
}
