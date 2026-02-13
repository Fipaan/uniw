"use strict";

$(function () {
    APP.renderNav("admin");

    function showErr(msg) {
        $("#alertBox").removeClass("d-none").text(msg);
    }

    function clearErr() {
        $("#alertBox").addClass("d-none").text("");
    }

    function fmtDate(s) {
        if (!s) return "";
        try {
            return new Date(s).toLocaleString();
        } catch (e) {
            return String(s);
        }
    }

    function requireAdminOrStop(me) {
        $("#navUser").text(me.username + " (" + me.role + ")");
        if (me.role === "admin") {
            $("#navAdmin").show();
            return true;
        }
        showErr("Forbidden: admin role required.");
        $("#btnRefreshAll").prop("disabled", true);
        $("#btnLoadUsers").prop("disabled", true);
        $("#btnLoadTasks").prop("disabled", true);
        return false;
    }

    function loadUsers() {
        clearErr();

        var q = String($("#usersQ").val() || "").trim();
        var role = String($("#usersRole").val() || "");

        var params = [];
        if (q) params.push("q=" + encodeURIComponent(q));
        if (role) params.push("role=" + encodeURIComponent(role));

        var url = "/api/admin/users" + (params.length ? ("?" + params.join("&")) : "");

        APP.api({ url: url })
            .done(function (docs) {
                var $tb = $("#usersTbody");
                $tb.empty();

                if (!docs || !docs.length) {
                    $tb.append("<tr><td colspan=\"5\" class=\"muted-small\">No users</td></tr>");
                    return;
                }

                docs.forEach(function (u) {
                    var row = ""
                        + "<tr>"
                        + "  <td><code>" + APP.escapeHtml(u.id) + "</code></td>"
                        + "  <td>" + APP.escapeHtml(u.username) + "</td>"
                        + "  <td>" + APP.escapeHtml(u.email) + "</td>"
                        + "  <td><span class=\"badge text-bg-secondary\">" + APP.escapeHtml(u.role) + "</span></td>"
                        + "  <td class=\"muted-small\">" + APP.escapeHtml(fmtDate(u.createdAt)) + "</td>"
                        + "</tr>";
                    $tb.append(row);
                });
            })
            .fail(function (xhr) {
                showErr(APP.errMsg(xhr));
            });
    }

    function loadTasks() {
        clearErr();

        var q = String($("#tasksQ").val() || "").trim();
        var status = String($("#tasksStatus").val() || "");
        var ownerId = String($("#tasksOwnerId").val() || "").trim();

        var params = [];
        if (q) params.push("q=" + encodeURIComponent(q));
        if (status) params.push("status=" + encodeURIComponent(status));
        if (ownerId) params.push("ownerId=" + encodeURIComponent(ownerId));

        var url = "/api/admin/tasks" + (params.length ? ("?" + params.join("&")) : "");

        APP.api({ url: url })
            .done(function (docs) {
                var $tb = $("#tasksTbody");
                $tb.empty();

                if (!docs || !docs.length) {
                    $tb.append("<tr><td colspan=\"7\" class=\"muted-small\">No tasks</td></tr>");
                    return;
                }

                docs.forEach(function (t) {
                    var due = t.dueDate ? fmtDate(t.dueDate) : "";
                    var tagsCount = Array.isArray(t.tagIds) ? t.tagIds.length : 0;

                    var row = ""
                        + "<tr>"
                        + "  <td><code>" + APP.escapeHtml(t._id) + "</code></td>"
                        + "  <td><code>" + APP.escapeHtml(String(t.ownerId || "")) + "</code></td>"
                        + "  <td>" + APP.escapeHtml(t.title) + "</td>"
                        + "  <td><span class=\"badge text-bg-secondary\">" + APP.escapeHtml(t.status) + "</span></td>"
                        + "  <td class=\"muted-small\">" + APP.escapeHtml(due) + "</td>"
                        + "  <td><code>" + APP.escapeHtml(String(t.projectId || "")) + "</code></td>"
                        + "  <td class=\"muted-small\">" + APP.escapeHtml(String(tagsCount)) + "</td>"
                        + "</tr>";
                    $tb.append(row);
                });
            })
            .fail(function (xhr) {
                showErr(APP.errMsg(xhr));
            });
    }

    APP.requireAuth(function (me) {
        if (!requireAdminOrStop(me)) return;
        loadUsers();
        loadTasks();
    });

    $("#btnLoadUsers").on("click", function () {
        loadUsers();
    });

    $("#btnLoadTasks").on("click", function () {
        loadTasks();
    });

    $("#btnRefreshAll").on("click", function () {
        loadUsers();
        loadTasks();
    });
});
