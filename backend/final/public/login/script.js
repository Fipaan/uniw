"use strict";

$(function () {
    APP.guardGuest();

    function showErr(msg) {
        $("#alertBox").removeClass("d-none").text(msg);
    }

    $("#loginForm").on("submit", function (e) {
        e.preventDefault();

        $("#alertBox").addClass("d-none").text("");

        var email = $("#email").val();
        var password = $("#password").val();

        APP.apiJson("POST", "/api/auth/login", {
            email: String(email || "").trim(),
            password: String(password || "")
        }).done(function () {
            window.location.href = "/dashboard";
        }).fail(function (xhr) {
            showErr(APP.errMsg(xhr));
        });
    });
});
