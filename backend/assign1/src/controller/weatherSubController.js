const data = require("../data/index")

exports.weather_sub_post = async (req, res, next) => {
    if (req.body === undefined) {
        res.status(404).json({
            error: "expected JSON input"
        })
        return
    }
    const { city, email } = req.body
    if (city === undefined) {
        res.status(404).json({
            error: "expected 'city' field"
        })
        return
    }
    if (email === undefined) {
        res.status(404).json({
            error: "expected 'email' field"
        })
        return
    }
    const error = data.addUser(email, city)
    if (error !== undefined) res.status(404)
    res.json({error})
}
