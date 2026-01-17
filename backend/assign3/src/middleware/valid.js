const FULL_NAME_MIN_LENGTH = 4
function verifyFullName(res, full_name) {
    if (full_name === undefined)
        return res.status(400).json({
            error: "full name is missing"
        })
    if (typeof full_name !== "string")
        return res.status(400).json({
            error: "full name is not a string"
        })
    if (full_name === "")
        return res.status(400).json({
            error: "full name is empty"
        })
    if (full_name.length < FULL_NAME_MIN_LENGTH)
        return res.status(400).json({
            error: "full name is too short"
        })
    return undefined
}

const emailRegex = /^[^\s@]+@[^\s@]+$/
function verifyEmail(res, email) {
    if (email === undefined) return undefined
    if (typeof email !== "string")
        return res.status(400).json({
            error: "email is not a string"
        })
    if (!emailRegex.test(email))
        return res.status(400).json({
            error: "provided email is not valid"
        })
}

const USERNAME_MIN_LENGTH = 6
function verifyUsername(res, username) {
    if (username === undefined) return undefined
    if (typeof username !== "string")
        return res.status(400).json({
            error: "username is not a string"
        })
    if (username === "")
        return res.status(400).json({
            error: "username is empty"
        })
    if (username.length < USERNAME_MIN_LENGTH)
        return res.status(400).json({
            error: "username is too short"
        })
    return undefined
}

const PASSWORD_MIN_LENGTH = 8
const PASSWORD_MAX_LENGTH = 20
function verifyPass(res, pass) {
    if (pass === undefined)
        return res.status(400).json({
            error: "password is missing"
        })
    if (typeof pass !== "string")
        return res.status(400).json({
            error: "password is not a string"
        })
    if (pass === "")
        return res.status(400).json({
            error: "password is empty"
        })
    if (pass.length < PASSWORD_MIN_LENGTH)
        return res.status(400).json({
            error: "password is too short"
        })
    if (pass.length < PASSWORD_MAX_LENGTH)
        return res.status(400).json({
            error: "password is too long"
        })
    return undefined
}

module.exports = {
    reg(req, res, next) {
        if (req.body === undefined)
            return res.status(400).json({
                error: "body is missing"
            })
        const {full_name, email, username, pass} = req.body
        let result = undefined
        result = verifyFullName(res, full_name)
        if (result !== undefined) return result
        if (email === undefined && username === undefined)
            return res.status(400).json({
                error: "email/username is missing"
            })
        result = verifyEmail(res, email)
        if (result !== undefined) return result
        result = verifyUsername(res, username)
        if (result !== undefined) return result
        result = verifyPass(res, pass)
        if (result !== undefined) return result
        
        next()
    }
}
