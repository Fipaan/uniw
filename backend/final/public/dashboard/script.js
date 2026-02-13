"use strict";

$(function () {
    APP.renderNav("dashboard");

    var state = {
        projects: [],
        tags: [],
        tasks: [],
        modal: null
    };

    function showErr(msg) {
        $("#alertBox").removeClass("d-none").text(msg);
    }

    function clearErr() {
        $("#alertBox").addClass("d-none").text("");
    }

    function modalErr(msg) {
        $("#taskModalAlert").removeClass("d-none").text(msg);
    }

    function modalClearErr() {
        $("#taskModalAlert").addClass("d-none").text("");
    }

    function fmtDate(s) {
        if (!s) return "";
        try {
            return new Date(s).toLocaleString();
        } catch (e) {
            return String(s);
        }
    }

    function isoToYmd(iso) {
        if (!iso) return "";
        try {
            return new Date(iso).toISOString().slice(0, 10);
        } catch (e) {
            return "";
        }
    }
    
    function ymdToIsoMidnightZ(ymd) {
        if (!ymd) return null;
        return ymd + "T00:00:00.000Z";
    }

    function projectName(id) {
        if (!id) return "(none)";
        var p = state.projects.find(function (x) { return x._id === id; });
        return p ? p.name : "(unknown)";
    }

    function renderProjectSelects() {
        var $filter = $("#projectId");
        var $task = $("#taskProject");

        $filter.find("option:not(:first)").remove();
        $task.find("option:not(:first)").remove();

        state.projects.forEach(function (p) {
            var o = "<option value=\"" + p._id + "\">" + APP.escapeHtml(p.name) + "</option>";
            $filter.append(o);
            $task.append(o);
        });
    }

    function renderTasks() {
        var $list = $("#taskList");
        $list.empty();

        if (!state.tasks.length) {
            $list.append("<li class=\"list-group-item\">No tasks found</li>");
            return;
        }

        state.tasks.forEach(function (t) {
            var due = t.dueDate ? (" | due: " + APP.escapeHtml(fmtDate(t.dueDate))) : "";
            var proj = t.projectId ? (" | project: " + APP.escapeHtml(projectName(t.projectId))) : "";
            var tags = Array.isArray(t.tagIds) && t.tagIds.length ? (" | tags: " + t.tagIds.length) : "";

            var html = ""
                + "<li class=\"list-group-item\" data-id=\"" + t._id + "\">"
                + "  <div class=\"d-flex justify-content-between align-items-start\">"
                + "    <div>"
                + "      <div class=\"fw-semibold\">" + APP.escapeHtml(t.title) + "</div>"
                + "      <div class=\"task-meta\">status: " + APP.escapeHtml(t.status) + proj + due + tags + "</div>"
                + "    </div>"
                + "    <span class=\"badge text-bg-secondary\">" + APP.escapeHtml(t.status) + "</span>"
                + "  </div>"
                + "</li>";

            $list.append(html);
        });
    }

    function loadProjects() {
        return APP.api({ url: "/api/projects" }).done(function (docs) {
            state.projects = docs || [];
            renderProjectSelects();
            renderProjectsPanel();
        });
    }

    function loadTags() {
        return APP.api({ url: "/api/tags" }).done(function (docs) {
            state.tags = docs || [];
            renderTagsPanel();
        });
    }

    function loadTasks() {
        clearErr();

        var q = String($("#q").val() || "").trim();
        var status = String($("#status").val() || "");
        var projectId = String($("#projectId").val() || "");

        var params = [];
        if (q) params.push("q=" + encodeURIComponent(q));
        if (status) params.push("status=" + encodeURIComponent(status));
        if (projectId) params.push("projectId=" + encodeURIComponent(projectId));

        var url = "/api/tasks" + (params.length ? ("?" + params.join("&")) : "");

        return APP.api({ url: url }).done(function (docs) {
            state.tasks = docs || [];
            renderTasks();
        }).fail(function (xhr) {
            showErr(APP.errMsg(xhr));
        });
    }

    function renderProjectsPanel() {
        var $wrap = $("#projectList");
        $wrap.empty();

        if (!state.projects.length) {
            $wrap.append("<div class=\"col-12 muted-small\">No projects</div>");
            return;
        }

        state.projects.forEach(function (p) {
            var html = ""
                + "<div class=\"col-12 col-md-6\">"
                + "  <div class=\"border rounded p-2 bg-light\">"
                + "    <div class=\"d-flex justify-content-between\">"
                + "      <div>"
                + "        <div class=\"fw-semibold\">" + APP.escapeHtml(p.name) + "</div>"
                + "        <div class=\"muted-small\">" + APP.escapeHtml(p.description || "") + "</div>"
                + "      </div>"
                + "      <div class=\"d-flex gap-2\">"
                + "        <button class=\"btn btn-outline-danger btn-sm btnDelProject\" data-id=\"" + p._id + "\" type=\"button\">Delete</button>"
                + "      </div>"
                + "    </div>"
                + "  </div>"
                + "</div>";
            $wrap.append(html);
        });
    }

    function renderTagsPanel() {
        var $wrap = $("#tagList");
        $wrap.empty();

        if (!state.tags.length) {
            $wrap.append("<div class=\"col-12 muted-small\">No tags</div>");
            return;
        }

        state.tags.forEach(function (t) {
            var html = ""
                + "<div class=\"col-12 col-md-6\">"
                + "  <div class=\"border rounded p-2 bg-light d-flex justify-content-between align-items-center\">"
                + "    <div class=\"d-flex align-items-center gap-2\">"
                + "      <span class=\"badge badge-tag\" style=\"background:" + APP.escapeHtml(t.color || "#6c757d") + ";\">&nbsp;</span>"
                + "      <span class=\"fw-semibold\">" + APP.escapeHtml(t.name) + "</span>"
                + "      <span class=\"muted-small\">" + APP.escapeHtml(t.color || "") + "</span>"
                + "    </div>"
                + "    <button class=\"btn btn-outline-danger btn-sm btnDelTag\" data-id=\"" + t._id + "\" type=\"button\">Delete</button>"
                + "  </div>"
                + "</div>";
            $wrap.append(html);
        });
    }

    function openTaskModal(task) {
        modalClearErr();

        $("#taskId").val(task ? task._id : "");
        $("#taskTitle").val(task ? task.title : "");
        $("#taskDesc").val(task ? (task.description || "") : "");
        $("#taskStatus").val(task ? task.status : "todo");
        $("#taskDue").val(task && task.dueDate ? isoToYmd(task.dueDate) : "");
        $("#taskProject").val(task && task.projectId ? task.projectId : "");

        var tagIds = task && Array.isArray(task.tagIds) ? task.tagIds : [];
        var $tags = $("#taskTags");
        $tags.empty();

        state.tags.forEach(function (t) {
            var checked = tagIds.includes(t._id) ? " checked" : "";
            var html = ""
                + "<div class=\"form-check form-check-inline\">"
                + "  <input class=\"form-check-input taskTagCb\" type=\"checkbox\" id=\"tag_" + t._id + "\" value=\"" + t._id + "\"" + checked + ">"
                + "  <label class=\"form-check-label\" for=\"tag_" + t._id + "\">"
                + "    <span class=\"badge\" style=\"background:" + APP.escapeHtml(t.color || "#6c757d") + ";\">"
                +       APP.escapeHtml(t.name)
                + "    </span>"
                + "  </label>"
                + "</div>";
            $tags.append(html);
        });

        $("#btnDeleteTask").toggle(!!task);

        $("#taskModalTitle").text(task ? "Edit task" : "New task");

        if (!state.modal) {
            state.modal = new bootstrap.Modal(document.getElementById("taskModal"));
        }
        state.modal.show();
    }

    function collectTaskFromModal() {
        var id = String($("#taskId").val() || "");
        var title = String($("#taskTitle").val() || "").trim();
        var description = String($("#taskDesc").val() || "");
        var status = String($("#taskStatus").val() || "todo");
        var dueRaw = String($("#taskDue").val() || "").trim();
        var projectId = String($("#taskProject").val() || "");

        var tagIds = [];
        $(".taskTagCb:checked").each(function () {
            tagIds.push(String($(this).val()));
        });

        var dueDate = null;
        if (dueRaw) {
            dueDate = ymdToIsoMidnightZ(dueRaw);
        }

        return {
            id: id,
            body: {
                title: title,
                description: description,
                status: status,
                dueDate: dueDate,
                projectId: projectId ? projectId : null,
                tagIds: tagIds
            }
        };
    }

    function refreshAll() {
        return $.when(loadProjects(), loadTags()).done(function () {
            loadTasks();
        });
    }

    APP.requireAuth(function (me) {
        $("#navUser").text(me.username + " (" + me.role + ")");
        if (me.role === "admin") {
            $("#navAdmin").show();
        }
        refreshAll();
    });

    $("#btnApplyFilters").on("click", function () {
        loadTasks();
    });

    $("#btnRefresh").on("click", function () {
        refreshAll();
    });

    $("#btnNewTask").on("click", function () {
        openTaskModal(null);
    });

    $("#taskList").on("click", ".list-group-item[data-id]", function () {
        var id = String($(this).attr("data-id") || "");
        var t = state.tasks.find(function (x) { return x._id === id; });
        if (t) openTaskModal(t);
    });

    $("#btnSaveTask").on("click", function () {
        modalClearErr();

        var data = collectTaskFromModal();
        if (!data.body.title) {
            modalErr("Title is required");
            return;
        }

        var isNew = !data.id;
        var method = isNew ? "POST" : "PUT";
        var url = isNew ? "/api/tasks" : ("/api/tasks/" + encodeURIComponent(data.id));

        APP.apiJson(method, url, data.body)
            .done(function () {
                APP.toast("Tasks", isNew ? "Created" : "Updated", "success");
                state.modal.hide();
                refreshAll();
            })
            .fail(function (xhr) {
                modalErr(APP.errMsg(xhr));
            });
    });

    $("#btnDeleteTask").on("click", function () {
        modalClearErr();

        var id = String($("#taskId").val() || "");
        if (!id) return;

        APP.api({ method: "DELETE", url: "/api/tasks/" + encodeURIComponent(id) })
            .done(function () {
                APP.toast("Tasks", "Deleted", "warning");
                state.modal.hide();
                refreshAll();
            })
            .fail(function (xhr) {
                modalErr(APP.errMsg(xhr));
            });
    });

    $("#btnAddProject").on("click", function () {
        var name = String($("#newProjectName").val() || "").trim();
        var description = String($("#newProjectDesc").val() || "");

        if (!name) {
            APP.toast("Projects", "Name is required", "danger");
            return;
        }

        APP.apiJson("POST", "/api/projects", { name: name, description: description })
            .done(function () {
                $("#newProjectName").val("");
                $("#newProjectDesc").val("");
                APP.toast("Projects", "Added", "success");
                loadProjects().done(function () {
                    loadTasks();
                });
            })
            .fail(function (xhr) {
                APP.toast("Projects", APP.errMsg(xhr), "danger");
            });
    });

    $("#projectList").on("click", ".btnDelProject", function () {
        var id = String($(this).attr("data-id") || "");
        if (!id) return;

        APP.api({ method: "DELETE", url: "/api/projects/" + encodeURIComponent(id) })
            .done(function () {
                APP.toast("Projects", "Deleted", "warning");
                loadProjects().done(function () {
                    loadTasks();
                });
            })
            .fail(function (xhr) {
                APP.toast("Projects", APP.errMsg(xhr), "danger");
            });
    });

    $("#btnAddTag").on("click", function () {
        var name = String($("#newTagName").val() || "").trim();
        var color = String($("#newTagColor").val() || "").trim();

        if (!name) {
            APP.toast("Tags", "Name is required", "danger");
            return;
        }

        APP.apiJson("POST", "/api/tags", { name: name, color: color || undefined })
            .done(function () {
                $("#newTagName").val("");
                $("#newTagColor").val("");
                APP.toast("Tags", "Added", "success");
                loadTags();
            })
            .fail(function (xhr) {
                APP.toast("Tags", APP.errMsg(xhr), "danger");
            });
    });

    $("#tagList").on("click", ".btnDelTag", function () {
        var id = String($(this).attr("data-id") || "");
        if (!id) return;

        APP.api({ method: "DELETE", url: "/api/tags/" + encodeURIComponent(id) })
            .done(function () {
                APP.toast("Tags", "Deleted", "warning");
                loadTags();
            })
            .fail(function (xhr) {
                APP.toast("Tags", APP.errMsg(xhr), "danger");
            });
    });
});
