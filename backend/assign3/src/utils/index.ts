import util from "util"

const INFO_PREFIX  = "INFO:  "
const ERROR_PREFIX = "ERROR: "

// TODO: proton.me/mail 4:38 PM

export default {
    INFO_S(...args: unknown[]): string {
        (args as any[]).unshift(INFO_PREFIX)
        return util.format(...(args as any))
    },
    INFO(...args: unknown[]): void {
        (args as any[]).unshift(INFO_PREFIX)
        console.log(...(args as any))
    },
    ERROR_S(...args: unknown[]): string {
        (args as any[]).unshift(ERROR_PREFIX)
        return util.format(...(args as any))
    },
    ERROR(...args: unknown[]): void {
        (args as any[]).unshift(ERROR_PREFIX)
        console.log(...(args as any))
    },
    LOG_S(...args: unknown[]): string {
        return util.format(...(args as any))
    },
}
