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

function sel(selector) { return document.querySelector(selector); }

function part1() {
    const observer = new MutationObserver(() => {
        const values = document.querySelectorAll("#part1 .fvalue");
        let hasText = false;
        for (const value of values) {
            if (value.textContent.trim()) {
                hasText = true;
                break;
            }
        }
        sel("#part1 .ftext").style.display = hasText ? "grid" : "none";
    });
    observer.observe(sel("#part1 .ftext"), { childList: true, subtree: true, characterData: true });
    document.getElementById("part1Form").addEventListener("submit", function(event) {
        event.preventDefault();
        if (!this.checkValidity()) return;

        const formData = new FormData(this);
        this.reset();
        const data = Object.fromEntries(formData.entries());

        sel("#part1 .fname").innerText    = data.name;
        sel("#part1 .femail").innerText   = data.email;
        sel("#part1 .fmessage").innerText = data.message;
    });
}


function part2() {
    const form = document.querySelector("#part2.needs-validation");
    
    form.addEventListener("submit", event => {
        event.preventDefault();
        event.stopPropagation();
        form.classList.add('was-validated');

        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());

        console.log("User input: ", data);

        if (form.checkValidity()) {
            alert("Sended!");
            form.reset();
        } else {
            alert("Form is invalid!");
        }
    }, false);
}

function part3() {
    const form = document.querySelector("#part3.needs-validation");
    const confirm = document.getElementById('confirmPassword');

    const genderRadios = Array.from(form.querySelectorAll("input[name=\"gender\"]"));
    const genderFeedback = document.getElementById("genderFeedback");

    const showGenderInvalid = () => {
      genderRadios.forEach(r => r.classList.add("is-invalid"));
      genderFeedback.classList.add("d-block");
    }
    const hideGenderInvalid = () => {
      genderRadios.forEach(r => r.classList.remove("is-invalid"));
      genderFeedback.classList.remove("d-block");
    }

    genderRadios.forEach(radio => {
      radio.addEventListener("change", () => {
        if (radio.checked) hideGenderInvalid();
      });
    });

    form.addEventListener("submit", e => {
        e.preventDefault();
        e.stopPropagation();
        form.classList.add('was-validated');

        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());

        console.log("User input: ", data);

        if (data.password !== data.confirm) {
            confirm.setCustomValidity("Passwords do not match");
        } else {
            confirm.setCustomValidity("");
        }

        const anyGender = genderRadios.some(r => r.checked);
        if (!anyGender) {
            showGenderInvalid();
        } else {
            hideGenderInvalid();
        }

        if (form.checkValidity()) {
            alert("Sended!");
            form.reset();
        } else {
            alert("Form is invalid!");
        }
    });
}

function modifyClass(selector, f) {
    for (const sheet of document.styleSheets) {
        for (const rule of sheet.cssRules) {
            if (rule.selectorText === selector) {
                f(rule.style);
            }
        }
    }
}

function main() {
    updatePageSize();
    window.addEventListener("resize", updatePageSize);
    
    part1();
    part2();
    part3();
}

// NOTE: normalized
function hsvToHsl(hsv) {
    let l = (2 - hsv.s) * hsv.v / 2;

    let s;
    if (l != 0) {
        if (l === 1) {
            s = 0;
        } else if (l < 0.5) {
            s = hsv.s * hsv.v / (l * 2);
        } else {
            s = hsv.s * hsv.v / (2 - l * 2);
        }
    } else {
        s = hsv.s;
    }

    return {h: hsv.h, s: s, l: l};
}
// NOTE: normalized
function hslToHsv(hsl) {
    let v = hsl.l + hsl.s * Math.min(hsl.l, 1 - hsl.l);
    let s = (v === 0) ? 0 : 2 * (1 - hsl.l / v);

    return {h: hsl.h, s: s, v: v};
}

function hsvNorm(hsv, reverse) {
    if (reverse === true) {
        hsv.h *= 360;
        hsv.s /= 100;
        hsv.v /= 100;
    } else {
        hsv.h /= 360;
        hsv.s /= 100;
        hsv.v /= 100;
    }
    return hsv;
}
function hslNorm(hsl, reverse) {
    if (reverse === true) {
        hsl.h *= 360;
        hsl.s *= 100;
        hsl.l *= 100;
    } else {
        hsl.h /= 360;
        hsl.s /= 100;
        hsl.l /= 100;
    }
    return hsl;
}
function parseHSL(col) {
    // Match hsl(H, S%, L%)
    const match = col.match(/hsl\(\s*([\d.]+)(?:deg)?[ ,]+([\d.]+)%[ ,]+([\d.]+)%\s*\)/i);

    if (match === null) throw new Error(`Invalid HSL format: ${col}`);

    let h = parseInt(match[1], 10);
    let s = parseFloat(match[2]) / 100;
    let l = parseFloat(match[3]) / 100;

    h = ((h % 360) + 360) % 360;
    s = Math.min(Math.max(s, 0), 1) * 100;
    l = Math.min(Math.max(l, 0), 1) * 100;

    return { h, s, l };
}
function extractHsl(varName) {
    const prop = getComputedStyle(root).getPropertyValue(varName);
    if (prop === null || prop === "") throw new Error(`There is no variable with the name: "${varName}"`);
    return parseHSL(prop);
}
function hsvToString(hsv) {
    return `(h: ${hsv.h}, s: ${hsv.s}, v: ${hsv.v})`;
}
function hslToString(hsl) {
    return `(h: ${hsl.h}, s: ${hsl.s}, l: ${hsl.l})`;
}
