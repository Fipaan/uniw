"use strict";

$(function () {
    APP.guardGuest();

    function showErr(msg) {
        $("#okBox").addClass("d-none").text("");
        $("#alertBox").removeClass("d-none").text(msg);
    }

    function showOk(msg) {
        $("#alertBox").addClass("d-none").text("");
        $("#okBox").removeClass("d-none").text(msg);
    }

    $("#regForm").on("submit", function (e) {
        e.preventDefault();

        $("#alertBox").addClass("d-none").text("");
        $("#okBox").addClass("d-none").text("");

        var username = $("#username").val();
        var email = $("#email").val();
        var password = $("#password").val();

        APP.apiJson("POST", "/api/auth/register", {
            username: String(username || "").trim(),
            email: String(email || "").trim(),
            password: String(password || "")
        }).done(function () {
            showOk("Registered. Redirecting to login...");
            setTimeout(function () {
                window.location.href = "/login";
            }, 600);
        }).fail(function (xhr) {
            showErr(APP.errMsg(xhr));
        });
    });
});
