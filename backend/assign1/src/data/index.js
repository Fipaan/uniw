const fs    = require("fs")
const path  = require("path")
const utils = require("../utils/index")
const FAVORITE_PATH = path.join(__dirname, "FAVORITES.json")
const USERS_PATH    = path.join(__dirname, "USERS.json")

const FETCH_SECS = 3600

const NOT_AVAILABLE_ERR = "city is not available"

async function fetchCity(name) {
    try {
        const apiKey = process.env.OPENWEATHER_KEY;
        const res = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?q=${name}&units=metric&APPID=${apiKey}`
        )
        if (!res.ok) return { error: NOT_AVAILABLE_ERR }
        const data = await res.json()
        return {
            data: {
                temp: data.main.temp,
                feels_like: data.main.feels_like,
                humidity: data.main.humidity,
                pressure: data.main.pressure,
                wind_speed: data.wind.speed,
                description: data.weather[0].description,
                icon: data.weather[0].icon,
                lat: data.coord.lat,
                lon: data.coord.lon,
                country: data.sys.country,
                rain_3h: data.rain?.["3h"] ?? 0,
            }
        }
    } catch (err) {
        return { error: err.message }
    }
}

class City {
    constructor(name) {
        this.name    = name
        this.data    = null
        this.fetched = -Infinity
    }
    async fetch() {
        const now = performance.now()
        if ((now - this.fetched) * 0.001 >= FETCH_SECS) {
            this.fetched = now
            let res = await fetchCity(this.name)
            if (res.error == undefined) {
                this.data = res.data
            }
            return res.error
        }
        if (this.data != null) return undefined
        return NOT_AVAILABLE_ERR
    }
    async toJSON(index=undefined) {
        let error = await this.fetch()
        let data  = error == undefined ? this.data : undefined
        return {name: this.name, index, data, error}
    }
}
async function createCity(name) {
    const city  = new City(name)
    const error = await city.fetch()
    if (error != undefined) return {error}
    return {city}
}

const favorites = []
const users     = []

async function pushCity(name) {
    for (const city of favorites) {
        if (city.name == name) return "already exists"
    }
    const res = await createCity(name)
    if (res.error == undefined) favorites.push(res.city)
    return res.error
}

function searchCity(name) {
    for (const city of favorites) {
        if (city.name == name) return city
    }
    return undefined
}


module.exports = {
    getFavorites() { return favorites },
    searchCity,
    moveCity(name, index) {
        for (let i = 0; i < favorites.length; ++i) {
            if (favorites[i].name != name) continue
            if (i == index) return undefined
            if (index >= favorites.length) index = favorites.length - 1
            else if (index < 0) index = 0
            const city = favorites.splice(i, 1)[0]
            favorites.splice(index, 0, city)
            return undefined
        }
        return "city is not in favorites"
    },
    pushCity,
    deleteCity(name) {
        for (let i = 0; i < favorites.length; ++i) {
            if (favorites[i].name != name) continue
            favorites.splice(i, 1)
            return undefined
        }
        return "city is not in favorites"
    },
    async loadFavorites() {
        utils.INFO("Loading favorites...")
        const favorites = JSON.parse(
            fs.readFileSync(FAVORITE_PATH, "utf8")
        )
        favorites.sort(function(a, b) {
            return a.index - b.index;
        });
        for (let i = 0; i < favorites.length; ++i) {
            const name  = favorites[i].name
            const error = await pushCity(name)
            if (error != undefined) {
                utils.ERROR(`Couldn't pre-load ${name} city: ${error}`)
            }
        }
    },
    saveFavorites() {
        utils.INFO("Saving favorites...")
        const favs = []
        for (let i = 0; i < favorites.length; ++i) {
            favs.push({index: i, name: favorites[i].name})
        }
        fs.writeFileSync(
            FAVORITE_PATH,
            JSON.stringify(favs, null, 4),
            "utf8"
        )
    },
    loadUsers() {
        utils.INFO("Loading users...")
        const usrs = JSON.parse(fs.readFileSync(USERS_PATH, "utf8"))
        for (user of usrs) users.push(user)
    },
    saveUsers() {
        utils.INFO("Saving users...")
        fs.writeFileSync(
            USERS_PATH,
            JSON.stringify(users, null, 4),
            "utf8"
        )
    },
    getUsers() {
        return users
    },
    addUser(email, city) {
        if (searchCity(city) === undefined) {
            return "city is not in favorites"
        }
        for (const user of users) {
            if (user.email === email) return "user already exists"
        }
        users.push({ email, city })
        return undefined
    }
}
