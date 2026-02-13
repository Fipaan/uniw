import express from "express";
import cors    from "cors";
import helmet  from "helmet";
import morgan  from "morgan";
import path    from "path";
import cookieParser from "cookie-parser";
import { fileURLToPath } from "url";

import { ENV } from "./config/env.js";
import { connectDb } from "./config/db.js";
import { ensureAdminUser } from "./config/admin.js";
import { errorHandler } from "./middleware/errorHandler.js";

import auth  from "./routes/auth.js";
import user  from "./routes/user.js";
import admin from "./routes/admin.js";
import task  from "./routes/task.js";
import tag   from "./routes/tag.js";
import project from "./routes/project.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname  = path.dirname(__filename);
const publicDir  = path.join(__dirname, "..", "public");

async function main() {
    await connectDb();
    ensureAdminUser();

    const app = express();

    app.use(helmet({ contentSecurityPolicy: false }));
    app.use(cors({ origin: ENV.CORS_ORIGIN === "*" ? true : ENV.CORS_ORIGIN, credentials: true }));
    app.use(morgan("dev"));
    app.use(express.json());
    app.use(cookieParser());

    app.use(express.static(publicDir));
    app.get("/", (_req, res) => res.redirect("/login"));

    app.use("/api/auth",     auth);
    app.use("/api/users",    user);
    app.use("/api/admin",    admin);
    app.use("/api/tasks",    task);
    app.use("/api/projects", project);
    app.use("/api/tags",     tag);

    app.use("/api", (_req, res) => res.status(404).json({ message: "Not found" }));

    app.use(errorHandler);

    app.listen(ENV.PORT, () => {
        console.log(`Server running on http://localhost:${ENV.PORT}`);
    });
}

main().catch((err) => {
    console.error(err);
    process.exit(1);
});
