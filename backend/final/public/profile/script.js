"use strict";

$(function () {
    APP.renderNav("profile");

    function showErr(msg) {
        $("#alertBox").removeClass("d-none").text(msg);
    }

    function clearErr() {
        $("#alertBox").addClass("d-none").text("");
    }

    function loadProfile() {
        clearErr();

        APP.api({ url: "/api/users/profile" })
            .done(function (me) {
                APP.me = me;

                $("#userId").val(me.id);
                $("#role").val(me.role);
                $("#username").val(me.username);
                $("#email").val(me.email);

                $("#navUser").text(me.username + " (" + me.role + ")");
                if (me.role === "admin") {
                    $("#navAdmin").show();
                }
            })
            .fail(function () {
                window.location.href = "/login";
            });
    }

    APP.requireAuth(function () {
        loadProfile();
    });

    $("#btnReload").on("click", function () {
        loadProfile();
    });

    $("#btnSave").on("click", function () {
        clearErr();

        var username = String($("#username").val() || "").trim();
        var email = String($("#email").val() || "").trim();

        APP.apiJson("PUT", "/api/users/profile", {
            username: username,
            email: email
        }).done(function () {
            APP.toast("Profile", "Saved", "success");
            loadProfile();
        }).fail(function (xhr) {
            showErr(APP.errMsg(xhr));
        });
    });
});
