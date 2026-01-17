const data = require("../data/index")

exports.weather_get = async (req, res, next) => {
    const cities = []
    const favorites = data.getFavorites()
    for (let i = 0; i < favorites.length; ++i) {
        const json = await favorites[i].toJSON(i)
        // NOTE: probably will never occur,
        // but just in case I check for it
        if (json.error !== undefined) {
            res.status(404).json(json)
            return
        }
        cities.push(json)
    }
    res.send(cities)
}

exports.weather_post = async (req, res, next) => {
    if (req.body === undefined) {
        res.status(404).json({
            error: "expected JSON input"
        })
        return
    }
    const city = req.body.city
    if (city === undefined) {
        res.status(404).json({
            error: "expected 'city' field"
        })
        return
    }
    const error = await data.pushCity(city)
    if (error !== undefined) {
        res.status(404).json({name: city, error})
        return
    }
    const json = await data.searchCity(city).toJSON()
    if (json.error !== undefined) res.status(404)
    res.json(json)
}
