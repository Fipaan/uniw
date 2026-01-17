const data = require("../data/index")

exports.weather_city_get = async (req, res, next) => {
    const city = data.searchCity(req.params.city)
    if (city == undefined) {
        res.status(404).json({
            error: "city not in favorites"
        })
        return
    }
    const json = await city.toJSON()
    if (json.error != undefined) res.status(404)
    res.json(json)
}
exports.weather_city_put = async (req, res, next) => {
    const index = req.body.index
    if (index == undefined) {
        res.status(404).json({
            error: "index was not provided"
        })
        return
    }
    const result = {error: data.moveCity(req.params.city, index)}
    if (result.error != undefined) res.status(404)
    else result.message = "OK"
    res.json(result)
}
exports.weather_city_delete = async (req, res, next) => {
    const result = {error: data.deleteCity(req.params.city)}
    if (result.error != undefined) res.status(404)
    else result.message = "OK"
    res.json(result)
}
