const express = require("express")
const data    = require("../data/index")
const weatherController = require("../controller/weatherController")
const weatherCityController = require("../controller/weatherCityController")
const weatherSubController = require("../controller/weatherSubController")
const router = express.Router()

router.get ("/", weatherController.weather_get)
router.post("/", weatherController.weather_post)

router.get   ("/:city", weatherCityController.weather_city_get)
router.put   ("/:city", weatherCityController.weather_city_put)
router.delete("/:city", weatherCityController.weather_city_delete)

router.post("/sub", weatherSubController.weather_sub_post)

module.exports = router
