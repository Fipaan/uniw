"use strict"

const URL = BASE + "/login"

$(document).ready(async function () {
    confToggler()
    const $emailOrUsername = $("#emailOrUsername")
    const $pass            = $("#pass")
    const $loginForm       = $("#loginForm")
    $loginForm.submit(function (e) {
        e.preventDefault()
        const emailOrUsername = $emailOrUsername.val()
        const email    = verifyEmail(emailOrUsername) ? emailOrUsername : undefined
        const username = email ? undefined : emailOrUsername
        const pass     = $pass.val()
        const body     = {email, username, pass}
        $.ajax({
            url:       URL,
            method:    "POST",
            xhrFields: { withCredentials: true },
            data:      body,
            success:   () => window.location.href = "../tasks",
            error:     (jqXHR, status, errorMsg) => {
                showError(jqXHR_get_err(jqXHR, errorMsg))
            },
        })
    })
})
