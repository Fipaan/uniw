"use strict";

(function () {
    window.APP = window.APP || {};

    APP.api = function (opts) {
        return $.ajax($.extend(true, {
            method: "GET",
            dataType: "json",
            contentType: "application/json",
            xhrFields: { withCredentials: true }
        }, opts));
    };

    APP.apiJson = function (method, url, bodyObj) {
        return APP.api({
            method: method,
            url: url,
            data: bodyObj ? JSON.stringify(bodyObj) : undefined
        });
    };

    APP.escapeHtml = function (s) {
        return String(s)
            .replaceAll("&", "&amp;")
            .replaceAll("<", "&lt;")
            .replaceAll(">", "&gt;")
            .replaceAll("\"", "&quot;")
            .replaceAll("'", "&#039;");
    };

    APP.toast = function (title, message, type) {
        var $wrap = $("#appToasts");
        if ($wrap.length === 0) {
            $("body").append(
                "<div id=\"appToasts\" class=\"toast-container position-fixed top-0 end-0 p-3\" style=\"z-index: 1080;\"></div>"
            );
            $wrap = $("#appToasts");
        }

        var cls = "text-bg-" + (type || "primary");
        var id = "t_" + Math.random().toString(16).slice(2);

        var html = ""
            + "<div id=\"" + id + "\" class=\"toast " + cls + "\" role=\"alert\" aria-live=\"assertive\" aria-atomic=\"true\">"
            + "  <div class=\"toast-header\">"
            + "    <strong class=\"me-auto\">" + APP.escapeHtml(title || "Notice") + "</strong>"
            + "    <button type=\"button\" class=\"btn-close\" data-bs-dismiss=\"toast\" aria-label=\"Close\"></button>"
            + "  </div>"
            + "  <div class=\"toast-body\">" + APP.escapeHtml(message || "") + "</div>"
            + "</div>";

        $wrap.append(html);

        var el = document.getElementById(id);
        var t = new bootstrap.Toast(el, { delay: 3500 });
        t.show();

        $(el).on("hidden.bs.toast", function () {
            $(el).remove();
        });
    };

    APP.errMsg = function (xhr) {
        try {
            if (xhr && xhr.responseJSON) {
                if (xhr.responseJSON.error) return String(xhr.responseJSON.error);
                if (xhr.responseJSON.message) return String(xhr.responseJSON.message);
                if (xhr.responseJSON.name) return String(xhr.responseJSON.name);
            }
        } catch (e) { }
        if (xhr && xhr.status) return "HTTP " + xhr.status;
        return "Request failed";
    };

    APP.renderNav = function (active) {
        var html = ""
            + "<nav class=\"navbar navbar-expand-lg navbar-dark bg-dark\">"
            + "  <div class=\"container app-container\">"
            + "    <a class=\"navbar-brand\" href=\"/dashboard\">TaskApp</a>"
            + "    <button class=\"navbar-toggler\" type=\"button\" data-bs-toggle=\"collapse\" data-bs-target=\"#navMain\" aria-controls=\"navMain\" aria-expanded=\"false\" aria-label=\"Toggle navigation\">"
            + "      <span class=\"navbar-toggler-icon\"></span>"
            + "    </button>"
            + "    <div class=\"collapse navbar-collapse\" id=\"navMain\">"
            + "      <ul class=\"navbar-nav me-auto mb-2 mb-lg-0\">"
            + "        <li class=\"nav-item\"><a class=\"nav-link" + (active === "dashboard" ? " active" : "") + "\" href=\"/dashboard\">Dashboard</a></li>"
            + "        <li class=\"nav-item\"><a class=\"nav-link" + (active === "profile" ? " active" : "") + "\" href=\"/profile\">Profile</a></li>"
            + "        <li class=\"nav-item\"><a id=\"navAdmin\" class=\"nav-link" + (active === "admin" ? " active" : "") + "\" href=\"/admin\" style=\"display:none;\">Admin</a></li>"
            + "      </ul>"
            + "      <div class=\"d-flex gap-2\">"
            + "        <span id=\"navUser\" class=\"navbar-text text-light muted-small\"></span>"
            + "        <button id=\"btnLogout\" class=\"btn btn-outline-light btn-sm\" type=\"button\">Logout</button>"
            + "      </div>"
            + "    </div>"
            + "  </div>"
            + "</nav>";

        $("#appNav").html(html);

        $("#btnLogout").on("click", function () {
            APP.logout();
        });
    };

    APP.logout = function () {
        APP.apiJson("POST", "/api/auth/logout", {})
            .always(function () {
                window.location.href = "/login";
            });
    };

    APP.requireAuth = function (onOk) {
        APP.api({ url: "/api/users/profile" })
            .done(function (me) {
                APP.me = me;
                if (typeof onOk === "function") onOk(me);
            })
            .fail(function () {
                window.location.href = "/login";
            });
    };

    APP.guardGuest = function () {
        APP.api({ url: "/api/users/profile" })
            .done(function () {
                window.location.href = "/dashboard";
            })
            .fail(function () {
                return;
            });
    };
})();
