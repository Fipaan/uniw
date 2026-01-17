"use strict"
function $bind(elem, e, func, call) {
    elem.on(e, func)
    if (call == true) func()
    return elem
}

function $inPlace(elem) {
    return $($.parseHTML(elem.trim()))
}

const $OPT_TEMPLATE = $inPlace(`
<div class="mb-3">
    <label class="form-label title"></label>
    <input class="form-control inp" required>
</div>
`)
function $newOpt($opts, title, type, hint, id, required) {
    const $opt = $OPT_TEMPLATE.clone()
    $opt.find(".title").first().text(title)
    $opt.find(".inp").first()
            .attr("type", type)
            .attr("placeholder", hint)
            .attr("id", id)
            .prop("required", required)
    $opts.append($opt)
}

const $ENTRY_TEMPLATE = $inPlace(`
<div class="d-flex align-items-center gap-3 entry">
    <h3 class="title h6 mb-0"></h3>
    <p class="text mb-0"></p>
</div>
`)
function newEntry($entries, title, text) {
    const $entry = $ENTRY_TEMPLATE.clone()
    $entry.find(".title").first().text(title)
    $entry.find(".text").first().text(text)
    $entries.append($entry)
}
const $CITY_TEMPLATE = $inPlace(`
<div class="mb-4">
    <h2 class="name h5"></h2>
    <div class="entries"></div>
</div>
`)
function newCity($cities, city) {
    const $city = $CITY_TEMPLATE.clone()
    $city.find(".name").first().text(city.name)
    const $entries = $city.find(".entries").first()
    for (const field in city.data) {
        const o = city.data[field]
        if (typeof o === "object") continue
        newEntry($entries, field, String(o))
    }
    $cities.append($city)
}
function newCities($cities, cities) {
    for (const field in cities) {
        newCity($cities, cities[field])
    }
}
function printError(e) {
    const $err = $("#output .err").last()
    $("#cities").hide()
    $err.removeClass("d-none").find("p").first().text(e)
    $("#output .ok").first().hide()
}
function clearError(showOk) {
    $("#output .err").last().addClass("d-none")
    $("#cities").show()
    if (showOk) $("#output .ok").first().show()
}

let _map = undefined
const cityMarkers = new Map()
function displayCity(city) {
    const { lat, lon } = city.data
    const h = ((lon + 180) % 360 + 360) % 360;
    const perc = 13 + 74*(lat+90)/180
    const l = Math.max(13, Math.min(87, perc));
    const icon = L.divIcon({
        className: "",
        html: `
          <svg width="20" height="20">
            <circle cx="10" cy="10" r="8" fill="hsl(${h}, 100%, ${l}%)">
          </svg>
        `
    })

    const old = cityMarkers.get(city.name)
    if (old) {
        _map.removeLayer(old)
        cityMarkers.remove(city.name)
    }
    cityMarkers.set(city.name, L
                    .marker([lat, lon], { icon }).addTo(_map)
                    .bindPopup(city.name))
}

async function requestSubmit(e) {
    e.preventDefault()
    const $request = $("#request")
    let req = "/api/weather"
    const reqBody = {
        method: $request.prop("value"),
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json",
        },
    }
    const city = $("#cityField").val()
    if (reqBody.method !== "POST" && city !== "") {
        req += "/" + city
    }
    const input = {}
    switch (reqBody.method) {
        case "GET":
        case "DELETE": break
        case "POST":
            input.city = city
            break
        case "PUT":
            input.index = $("#indexField").val()
            break
        default:
            alert(`${reqBody.method}: unknown method`)
            break
    }
    if (reqBody.method !== "GET") {
        reqBody.body = JSON.stringify(input)
    }
    const response = await fetch(req, reqBody)
    const json     = await response.json()
    if (!response.ok) {
        printError(json.error)
        return
    } else clearError(reqBody.method !== "GET")
    switch (reqBody.method) {
        case "DELETE":
            const old = cityMarkers.get(city)
            if (old !== undefined) {
                _map.removeLayer(old)
                cityMarkers.delete(city)
            }
            break
        case "POST":
            displayCity(json)
            break
        case "GET":
            const $cities = $("#cities")
            $cities.empty()
            if (city === "") newCities($cities, json)
            else newCity($cities, json)
            break
        default: break
    }
}

async function prepareMap() {
    _map = L.map("map").setView([0, 0], 2) // global view
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "&copy; OpenStreetMap contributors"
    }).addTo(_map)
    
    const response = await fetch("/api/weather", {
        method: "GET",
        headers: { "Accept": "application/json" },
    })
    const cities = await response.json()
    if (!response.ok) return

    for (const city of cities) {
        displayCity(city)
    }
}

$(document).ready(function () {
    const $switcher = $("#themeSwitch")
    $bind($switcher, "change", function () {
        $("html").attr("data-bs-theme",
                $switcher.prop("checked") ?
                "dark" :
                "light")
    }, true)
    const $request   = $("#request")
    const $prompt    = $("#prompt")
    const $opts      = $("#opts")
    const $cities    = $("#cities")
    const $subscribe = $("#subscribe")
    $prompt.on("submit", requestSubmit)
    $subscribe.on("submit", async function(e) {
        e.preventDefault()
        const response = await fetch("/api/weather/sub", {
            method: "POST",
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                email: $subscribe.find(".email").first().val(),
                city:  $subscribe.find(".city").first().val(),
            })
        })
        const json = await response.json()
        if (!response.ok) {
            printError(json.error)
            return
        } else clearError(false)
        alert("subscribed!")
    })
    clearError(false)
    $("#output .ok").first().hide()
    $bind($request, "change", function () {
        $opts.empty()
        $cities.empty()
        const method = $request.prop("value")
        switch (method) {
            case "GET":
                $newOpt($opts, "City", "text", "Name (optional)", "cityField", false)
                break
            case "POST":
            case "DELETE":
                $newOpt($opts, "City", "text", "Name (required)", "cityField", true)
                break
            case "PUT":
                $newOpt($opts, "City", "text", "Name (required)", "cityField", true)
                $newOpt($opts, "Index", "number", "Index (required)", "indexField", true)
                break
            default:
                alert(`${method}: unknown method`)
                break
        }
    }, true)
    prepareMap()
})

// <div class="mb-3">
//     <label class="form-label">Email</label>
//     <input type="email" class="form-control" placeholder="name@example.com">
// </div>

// <div class="mb-3 form-check">
//     <input type="checkbox" class="form-check-input" id="remember">
//     <label class="form-check-label" for="remember">Remember me</label>
// </div>
