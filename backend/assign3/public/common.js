"use strict"
function $bind(elem, e, func, call) {
    elem.on(e, func)
    if (call) func(e)
    return elem
}

function $inPlace(elem) {
    return $($.parseHTML(elem.trim()))
}


function showError(err) {
    if (err === "token is missing") err = "Session expired"
    $("#error").removeClass("d-none").find(".text").first().text(err || "Error")
}

function jqXHR_get_err(jqXHR) {
    let errorMsg = jqXHR.responseJSON.error ??
                   jqXHR.statusText ?? "Unknown error"
    if (jqXHR.status === 500) errorMsg = `${jqXHR.status}: ${errorMsg}`
    return errorMsg
}

const emailRegex = /^[^\s@]+@[^\s@]+$/
function verifyEmail(email) {
    if (email === undefined) return false
    if (typeof email !== "string") return false
    return emailRegex.test(email)
}

const BASE = "http://localhost:3000/api"

const DARK = {
    isDark:        true,
    back:          "#181818FF",
    fore:          "#FFFFFFFF",
    backInv:       "#555555FF",
    foreInv:       "#181818FF",
    backForm:      "#181818FF",
    foreForm:      "#FFFFFFFF",
    backFormFocus: "#333333FF",
    foreFormFocus: "#FFFFFFFF",
    hintForm:      "#888888FF",
    toRemove:      "btn-outline-light",
    toAdd:         "btn-outline-dark",
}

const LIGHT = {
    isDark:        false,
    back:          "#FFFFFFFF",
    fore:          "#181818FF",
    backInv:       "#444444FF",
    foreInv:       "#FFFFFFFF",
    backForm:      "#FFFFFFFF",
    foreForm:      "#181818FF",
    backFormFocus: "#CCCCCCFF",
    foreFormFocus: "#181818FF",
    hintForm:      "#090909FF",
    toRemove:      "btn-outline-dark",
    toAdd:         "btn-outline-light",
}

function confToggler() {
    const style = document.documentElement.style
    const $themeToggle = $("#themeToggle")
    const updateTheme = function() {
        const THEME = localStorage.getItem("theme") === "dark" ? DARK : LIGHT
        style.setProperty("--back",            THEME.back)
        style.setProperty("--fore",            THEME.fore)
        style.setProperty("--back-inv",        THEME.backInv)
        style.setProperty("--fore-inv",        THEME.foreInv)
        style.setProperty("--back-form",       THEME.backForm)
        style.setProperty("--fore-form",       THEME.foreForm)
        style.setProperty("--back-form-focus", THEME.backFormFocus)
        style.setProperty("--fore-form-focus", THEME.foreFormFocus)
        style.setProperty("--form-hint",       THEME.hintForm)
        $themeToggle.addClass(THEME.toAdd)
        $themeToggle.removeClass(THEME.toRemove)
        const icon = $themeToggle.data(THEME.isDark ? "icon-on" : "icon-off")
        $themeToggle.find("i").attr("class", `bi ${icon}`)
    }
    if (localStorage.getItem("theme") === undefined)
        localStorage.setItem("theme", "light")
    updateTheme()
    
    $themeToggle.on("click", function () {
        localStorage.setItem("theme",
                             localStorage.getItem("theme") === "dark" ?
                             "light" : "dark")
        updateTheme()
    })
}
