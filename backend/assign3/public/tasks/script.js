"use strict"

const URL         = BASE + "/tasks"
const URL_PROFILE = BASE + "/profile"
const URL_LOGOUT  = BASE + "/logout"

let is_jqXHR = false
function handleErr(err) {
    if (is_jqXHR) err = jqXHR_get_err(err)
    else err = `${err}`
    showError(err)
    const $mainData = $("#mainData")
    $mainData.addClass("d-none")
}

function jsonParse(json) {
    let obj = undefined
    let err    = undefined
    try {
        obj = JSON.parse(json)
    } catch (_err) {
        is_jqXHR = false
        err = _err
    }
    return { obj, err }
}

function setText($obj, text) {
    if ((text ?? undefined) === undefined) $obj.addClass("unknown")
    else $obj.removeClass("unknown")
    $obj.text(text ?? "unknown")
}

async function getProfile() {
    let profile = undefined
    is_jqXHR = true
    try {
        profile = await $.ajax({
            url:       URL_PROFILE,
            method:    "GET",
            xhrFields: { withCredentials: true },
        })
    } catch (err) {
        profile = undefined
        handleErr(err)
    }
    if (profile === undefined) return false
    setText($("#userFullName"), profile.full_name)
    setText($("#userUsername"), profile.username)
    setText($("#userEmail"),    profile.email)
    return true
}

const $TASK_TEMPLATE = $inPlace(`
    <tr>
        <td class="title"><span class="v"></span><span class="unsaved-mark">*</span></td>
        <td class="desc"><span class="v"></span><span class="unsaved-mark">*</span></td>
        <td class="status"><span class="v"></span><span class="unsaved-mark">*</span></td>
        <td class="text-end">
            <button class="btn btn-sm btn-primary update">Update</button>
            <button class="btn btn-sm btn-danger  delete">Delete</button>
        </td>
    </tr>
`)

function setTaskDirty($task, key, val) {
    const dirty = ($task.data("dirty") ?? {})
    dirty[key] = val
    $task.data("dirty", dirty)

    $task.find(`td.${key}`).toggleClass("unsaved", dirty[key])
}

function bindEditableText($task, key, opts) {
    const $td = $task.find(`td.${key}`).first()
    const $v  = $td.find(".v").first()

    let editing = false
    let $editor = null

    function enter() {
        if (editing) return
        editing = true

        const cur = $v.text()

        $editor = opts.multiline
            ? $(`<textarea class="form-control form-control-sm" rows="2"></textarea>`)
            : $(`<input class="form-control form-control-sm" type="text">`)

        $editor.val(cur)
        $v.hide()
        $td.prepend($editor)
        $editor.trigger("focus")

        $(document).on("mousedown.task-edit", function(ev) {
            if ($(ev.target).closest($td).length) return
            exit()
        })
    }

    function exit() {
        if (!editing) return
        editing = false

        const next = ($editor.val() ?? "").toString()
        $editor.remove()
        $editor = null
        $(document).off("mousedown.task-edit")

        const prev = $v.text()
        $v.text(next).show()

        if (next !== prev) setTaskDirty($task, key, true)
    }

    $td.on("click", function(ev) {
        if ($(ev.target).is("input,textarea")) return
        if (!editing) enter()
    })

    $td.on("keydown", "input", function(ev) {
        if (ev.key === "Enter") exit()
        if (ev.key === "Escape") {
            const cur = $v.text()
            $(this).val(cur)
            exit()
        }
    })
    $td.on("keydown", "textarea", function(ev) {
        if (ev.key === "Escape") {
            const cur = $v.text()
            $(this).val(cur)
            exit()
        }
    })
}

function bindStatusToggle($task) {
    const $td = $task.find("td.status").first()
    const $v  = $td.find(".v").first()

    $td.addClass("user-select-none")
    $td.css("cursor", "pointer")

    $td.on("click", function() {
        const cur = $task.data("done") === true
        const next = !cur
        $task.data("done", next)
        $v.text(next ? "done" : "not done")
        setTaskDirty($task, "status", true)
    })
}

function newTask(task) {
    const $task   = $TASK_TEMPLATE.clone()
    const $titleV = $task.find("td.title .v").first()
    const $descV  = $task.find("td.desc  .v").first()
    const $statV  = $task.find("td.status .v").first()

    $titleV.text(task.title)
    $descV.text(task.desc ?? "")
    $statV.text(task.done ? "done" : "not done")

    $task.data("done", task.done)

    const id = task._id

    bindEditableText($task, "title", { multiline: false })
    bindEditableText($task, "desc",  { multiline: true  })
    bindStatusToggle($task)

    $task.find(".update").first().on("click", async function() {
        const dirty = ($task.data("dirty") ?? {})
        if ((dirty.title ?? dirty.desc ?? dirty.status) === undefined) return

        const payload = {}
        if (dirty.title !== undefined)
            payload.title = $task.find("td.title .v").first().text()
        if (dirty.desc  !== undefined)
            payload.desc = $task.find("td.desc .v").first().text()
        if (dirty.status !== undefined)
            payload.done = $task.data("done") === true
        
        await $.ajax({
            url:         `${URL}/${id}`,
            method:      "POST",
            contentType: "application/json",
            data:        JSON.stringify(payload),
            xhrFields:   { withCredentials: true },
        })

        setTaskDirty($task, "title",  false)
        setTaskDirty($task, "desc",   false)
        setTaskDirty($task, "status", false)

        await loadTasks()
    })

    $task.find(".delete").first().on("click", async function() {
        await $.ajax({
            url:       `${URL}/${id}`,
            method:    "DELETE",
            xhrFields: { withCredentials: true },
        })
        await loadTasks()
    })

    return $task
}

async function loadTasks() {
    const $tastTable = $("#taskTable")
    is_jqXHR = true
    try {
        const tasks = await $.ajax({
            url:       URL,
            method:    "GET",
            xhrFields: { withCredentials: true },
        })
        $tastTable.empty()
        for (const task of tasks) {
            $tastTable.append(newTask(task))
        }
    } catch (err) {
        handleErr(err)
    }
}

$(document).ready(async function () {
    confToggler()
    if (!(await getProfile())) return
    const $title  = $("#title")
    const $desc   = $("#desc")
    const $status = $("#status")
    $("#taskForm").submit(async function (e) {
        e.preventDefault()
        const title  = $title.val()  ?? undefined
        const desc   = $desc.val()   ?? undefined
        const status = $status.val() ?? undefined
        const done   = status === "completed"
        const body = {title, desc, done}
        try {
            is_jqXHR = true
            await $.ajax({
                url:       URL,
                method:    "POST",
                xhrFields: { withCredentials: true },
                data:      body,
            })
            await loadTasks()
        } catch (err) {
            handleErr(err)
        }
    })

    $("#logout").click(() => {
        $.post(URL_LOGOUT, () => window.location.href = "../login")
    })

    await loadTasks()
})
