"use strict";
const root = document.documentElement;
const global = {
    screen: {
        width:  0,
        height: 0,
    }
}

function updatePageSize() {
    global.screen.width  = window.innerWidth  * window.devicePixelRatio;
    global.screen.height = window.innerHeight * window.devicePixelRatio;
    root.style.setProperty("--r-w",  `${global.screen.width}px`);
    root.style.setProperty("--r-h",  `${global.screen.height}px`);
}

function task0() {
    // Task 0. First Script
    const student = {
        name: "Mozgovoy Roman",
        group: "SE-2419"
    };
    console.log(`name: ${student.name}, group: ${student.group}`);
    alert("Hello, JavaScript World!");
}
function task1() {
    // Task 1. Variables & Operators
    let timeString = "Morning";
    let favoriteNumber = 42;
    let goodMood = true;
    
    console.log("String:", timeString);
    console.log("Number:", favoriteNumber);
    console.log("Boolean:", goodMood);
    
    let favoriteScaled = favoriteNumber*3
                      + (favoriteNumber/2 + 19)*10
                      - 2*(favoriteNumber+11);
    let favoriteGoodMood = goodMood ? favoriteScaled : favoriteNumber;
    console.log("Favorite number:", favoriteNumber);
    console.log("Favorite number:", favoriteScaled,   "(when I have good mood)");
    console.log("Favorite number:", favoriteGoodMood, "(right now)");
    
    let fullSentence = "Good " + timeString + "! I like this number: " + favoriteNumber;
    console.log(fullSentence);
}
function task2() {
    // Task 2. Changing Content
    changeTextBtn.addEventListener("click", () => {
        changeTextP.textContent = "hehe";
    });
}
function task3() {
    // Task 3. Changing Styles
    const style = colorBlock.style;
    colorBtn.addEventListener("click", () => {
        const isGreen = style.backgroundColor === "var(--c-valid)";
        if (isGreen) {
            style.color = "var(--c-f)";
            style.backgroundColor = "var(--c-invalid)";
        } else {
            style.color = "var(--c-f-r)";
            style.backgroundColor = "var(--c-valid)";
        }
    });
    document.getElementById("fontBtn").addEventListener("click", () => {
        style.fontSize = style.fontSize === "var(--fs-h3)" ?
                         "var(--fs-h4)" :
                         "var(--fs-h3)";
    });
}
function task4() {
    // Task 4. Creating & Removing Elements
    addItemBtn.addEventListener("click", () => {
        const li = document.createElement("li");
        li.textContent = "> Item " + (itemList.children.length + 1);
        itemList.appendChild(li);
    });
    removeItemBtn.addEventListener("click", () => {
        const child = itemList.lastElementChild;
        if (child) itemList.removeChild(child);
    });
}
function task5() {
    // Task 5: Mouse Events
    hoverBox.addEventListener("mouseover", () => hoverBox.style.backgroundColor = "orange");
    hoverBox.addEventListener("mouseout",  () => hoverBox.style.backgroundColor = "purple");
}
function task6() {
    // Task 6: Keyboard Events
    liveInput.addEventListener("keyup", () => {
        liveOutput.textContent = liveInput.value;
    });
}

function successElem(elem, isSuccess, actionOnSuccess, actionOnFail) {
    if (isSuccess) {
        if (!actionOnSuccess()) return;
        elem.classList.remove("error");
        elem.classList.add("success");
    } else {
        if (!actionOnFail()) return;
        elem.classList.remove("success");
        elem.classList.add("error");
    }
}
function successTextElem(elem, isSuccess, textOnSuccess, textOnFail) {
    successElem(elem, isSuccess, () => {
        elem.textContent = textOnSuccess;
        return true;
    }, () => {
        elem.textContent = textOnFail;
        return true;
    }); 
}

function task7() {
    // Task 7: Form Validation
    document.getElementById("myForm").addEventListener("submit", (e) => {
        e.preventDefault();
        const name     = formName.value.trim();
        const email    = formEmail.value.trim();
        const password = formPassword.value.trim();
        const isCorrect = name && email && password;
        successTextElem(formMsg, isCorrect,
                          "Form submitted succesfully!",
                          "All fields are required!");
    });
}
function task8() {
    // Task 8. Build a To-Do App
    const tasks = [];
    const displayStyle = taskInput.style.display;
    addTaskBtn.addEventListener("click", () => {
        const text = taskInput.value.trim();
        successElem(todoErrorMsg, text, () => {
                todoErrorMsg.textContent = "";
                todoErrorMsg.style.display = "none";
                return true;
            }, () => {
                todoErrorMsg.textContent = "You didn't specified TODO!";
                todoErrorMsg.style.display = displayStyle;
                return true;
            }
        );
        if (!text) return;
    
        const li = document.createElement("li");
        li.className = "todo-item";
        li.textContent = text;
    
        li.addEventListener("click", () => li.classList.toggle("completed"));
    
        const del = document.createElement("button");
        del.textContent = "Delete";
        del.classList.add("todo-btn");
        del.addEventListener("click", () => {
            taskList.removeChild(li);
            const index = tasks.indexOf(text);
            if (index !== -1) tasks.splice(index, 1);
        });
    
        li.appendChild(del);
        taskList.appendChild(li);
        tasks.push(text);
        taskInput.value = "";
    });
}

function main() {
    updatePageSize();
    window.addEventListener("resize", updatePageSize);
    // Part 1. Introduction
    task0();
    task1();
    // Part 2. DOM Manipulation
    task2();
    task3();
    task4();
    // Part 3. Events
    task5();
    task6();
    task7();
    // Part 4. Mini Project - Interactive To-Do List
    task8();
}
