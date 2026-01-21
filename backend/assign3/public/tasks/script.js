"use strict"

const URL         = BASE + "/tasks"
const URL_PROFILE = BASE + "/profile"
const URL_LOGOUT  = BASE + "/logout"

let is_jqXHR = false
function handleErr(err, is_jqXHR) {
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
        handleErr(err, is_jqXHR)
    }
    if (profile === undefined) return false
    setText($("#userFullName"), profile.full_name)
    setText($("#userUsername"), profile.username)
    setText($("#userEmail"),    profile.email)
    return true
}

const $TASK_TEMPLATE = $inPlace(`
    <tr>
        <td class="title"></td>
        <td class="desc"></td>
        <td class="status"></td>
        <td>
            <button class="btn btn-sm btn-danger">Delete</button>
        </td>
    </tr>
`)
function newTask(task) {
    const $task = $TASK_TEMPLATE.clone()
    $task.find(".title").first().text(task.title)
    $task.find(".desc").first().text(task.description)
    $task.find(".status").first().text(task.status)
    const id = task._id
    $task.find(".btn").first().on("click", async function() {
        tasks = await $.ajax({
            url: `${URL}/${id}`,
            method: "DELETE",
            xhrFields: { withCredentials: true },
        })
        await loadTasks(tasks)
    })
    return $task
}

async function loadTasks() {
    const $tastTable = $("#taskTable")
    let is_jqXHR = true
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
        handleErr(err, is_jqXHR)
    }
}

$(document).ready(async function () {
    confToggler()
    if (!(await getProfile())) return
    $("#taskForm").submit(async function (e) {
        e.preventDefault()
    
        tasks = await $.ajax({
            url:       URL,
            method:    "POST",
            xhrFields: { withCredentials: true },
            data:      $(this).serialize(),
        })
        await loadTasks(tasks)
    })

    $("#logout").click(() => {
        $.post(URL_LOGOUT, () => window.location.href = "../login")
    })

    await loadTasks()
})
