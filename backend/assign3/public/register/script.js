"use strict"

const URL = BASE + "/register"

function unmangle(str) { return str === "" ? undefined : str }

$(document).ready(async function () {
    confToggler()
    const $registerForm = $("#registerForm")
    const $success      = $("#success")
    const $error        = $("#error")
    const $email        = $("#email")
    const $username     = $("#username")
    const $full         = $("#full")
    const $pass         = $("#pass")
    $registerForm.submit(function (e) {
        e.preventDefault()
        const email    = unmangle($email.val())
        const username = unmangle($username.val())
        if (username === undefined && email === undefined) {
            showError("You need to specify email or/and username")
            return
        }
        const full_name = $full.val()
        const pass      = $pass.val()
        const body      = {full_name, email, username, pass}
        $.ajax({
            url:       URL,
            method:    "POST",
            data:      body,
            success:   () => {
                $success.removeClass("d-none").text("Registered successfully")
                $error.addClass("d-none")
            },
            error:     (jqXHR, status, errorMsg) => {
                showError(jqXHR_get_err(jqXHR, errorMsg))
            },
        })
    })
})
