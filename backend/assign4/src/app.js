const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const { sanitizeBody } = require("./utils/sanitize");
const { authRouter } = require("./routes/auth.routes");
const { tasksRouter } = require("./routes/tasks.routes");
const { meRouter } = require("./routes/me.routes");
const { errorHandler } = require("./middleware/error");

function createApp() {
    const app = express();

    app.use(helmet());
    app.use(cors({ origin: true, credentials: true }));
    app.use(morgan("dev"));

    app.use(express.json({ limit: "200kb" }));
    app.use(cookieParser());
    app.use(sanitizeBody);

    app.get("/api/health", (req, res) => res.json({ status: "OK" }));

    app.use("/api/auth", authRouter);
    app.use("/api/tasks", tasksRouter);
    app.use("/api/me", meRouter);

    app.use(errorHandler);

    return app;
}

module.exports = { createApp };
