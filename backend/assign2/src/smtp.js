const nodemailer = require("nodemailer")
const cron       = require("node-cron")
const data       = require("./data/index")

const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: true,
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
    },
    connectionTimeout: 10000,
})

function sendMail(to, subject, html) {
    return transporter.sendMail({
        from: `"Weather API" <${process.env.SMTP_USER}>`,
        to,
        subject,
        html
    })
}

exports.sendMail = sendMail

function recommendation(data) {
    if (data.temp < 5)    return "Dress warmly"
    if (data.rain_3h > 0) return "Take an umbrella"
    if (data.temp > 25)   return "Wear light clothes"
    return "Have a nice day!"
}

async function sendUpdate(subject, intro) {
    const users = data.getUsers()

    for (const u of users) {
        const city = data.searchCity(u.city)
        if (!city) continue

        const w = await city.toJSON()
        if (w.error) continue

        const rec = recommendation(w.data)

        await sendMail(
            u.email,
            subject,
            `
            <p>${intro}</p>
            <p><b>${u.city}</b>: ${w.data.temp}°C, ${w.data.description}</p>
            <p>${rec}</p>
            `
        )
    }
}

async function fetchTomorrowForecast(city) {
    const apiKey = process.env.OPENWEATHER_KEY

    const res = await fetch(
        `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=${apiKey}`
    )

    if (!res.ok) return null

    const data = await res.json()

    const tomorrow = data.list.find(x =>
        x.dt_txt.includes("12:00:00") // arbitrary time
    )
    if (!tomorrow) return null

    return {
        temp: tomorrow.main.temp,
        rain_3h: tomorrow.rain?.["3h"] ?? 0,
        description: tomorrow.weather[0].description
    }
}

cron.schedule("0 0 9 * * *", () =>
    sendUpdate("Morning Weather Update", "Good morning!")
)

cron.schedule("0 0 13 * * *", () =>
    sendUpdate("Afternoon Weather Update", "Good afternoon!")
)

cron.schedule("0 0 20 * * *", () =>
    sendUpdate("Evening Weather Update", "Good evening!")
)

cron.schedule("0 0 22 * * *", async () => {
    const users = data.getUsers()

    for (const u of users) {
        const forecast = await fetchTomorrowForecast(u.city)
        if (!forecast) continue

        const rec = recommendation(forecast)

        await sendMail(
            u.email,
            "Tomorrow’s Weather Forecast",
            `
            <p>Tomorrow in <b>${u.city}</b>:</p>
            <p>${forecast.temp}°C, ${forecast.description}</p>
            <p><b>Recommendation:</b> ${rec}</p>
            `
        )
    }
})
