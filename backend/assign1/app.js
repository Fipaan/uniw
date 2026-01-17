const express = require("express")
const path    = require('path');
const app     = express()
const port    = 3000

app.use(express.urlencoded({ extended: true }))
app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "index.html"));
})

function sendErr(res, err) {
    res.send(`<html>
        <head>
            <title>Error!</title>
            <link rel="stylesheet" href="/style.css">
        </head>
        <body>
            <h1>BMI Result</h1>
            <p>Error: <span class="err">${err}</span></p>
            <a href="/">Back</a>
        </body>
    </html>`);
}

function verifyProp(res, prop, name) {
    const result = prop > 0.0
    if (!result) {
        sendErr(res, `${name} is ${prop == 0 ? "zero" : "negative"}!`)
    }
    return result
}

app.post("/calculate-bmi", (req, res) => {
    const { weight, height, exercies, sleepTime } = req.body;

    if (!verifyProp(res, weight,    "weight"))    return
    if (!verifyProp(res, height,    "height"))    return
    if (!verifyProp(res, exercies,  "exercies"))  return
    if (!verifyProp(res, sleepTime, "sleepTime")) return

    const bmi = weight / (height * height);
    let category, categoryCls, sleepCls;
    recs = ""
    
    if (bmi < 18.5) {
        category     = "Underweight"
        categoryCls  = "warn"
        recs        += "You need to eat more."
    } else if (bmi < 24.9) {
        category     = "Normal weight"
        categoryCls  = "info"
        recs        += "Your weight is good."
    } else if (bmi < 29.9) {
        category     = "Overweight"
        categoryCls  = "warn"
        recs        += "You probably need to eat more healthy food."
    } else {
        category     = "Obese"
        categoryCls  = "err"
        recs        += "You need to go the doctor to check your weight."
    }
    recs += "<br>"
    if ((category == "Overweight" || category == "Obese") && exercies < 5) {
        recs += "You could try to do more exercies."
    } else {
        recs += "Amount of exercies is fine."
    }
    recs += "<br>"
    if (sleepTime < 4) {
        recs += "Sleep time is too small, you need to sleep more."
        sleepCls = "err"
    } else if (sleepTime < 7) {
        recs += "Amount of sleep is not that bad, but you probably need to sleep more."
        sleepCls = "warn"
    } else if (sleepTime < 9) {
        recs += "Sleep time is good."
        sleepCls = "info"
    } else if (sleepTime < 14) {
        recs += "You probably oversleeping."
        sleepCls = "warn"
    } else {
        recs += "Sleep time is too big, check the doctor."
        sleepCls = "err"
    }
    res.send(`<html>
        <head>
            <title>Result</title>
            <link rel="stylesheet" href="/style.css">
        </head>
        <body>
            <h1>BMI Result</h1>
            <p>BMI: ${bmi}</p>             
            <p>Exercies: ${exercies}</p>   
            <p>Sleep Time: <span class="${sleepCls}">${sleepTime}</span></p>
            <p>Category: <span class="${categoryCls}">${category}</span></p>
            <p>Recommendations:<br>${recs}</p>
            <a href="/">Back</a>
        </body>
    </html>`);
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})
