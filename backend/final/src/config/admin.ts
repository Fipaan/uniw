import { ENV } from "./env.js";
import { User } from "../models/User.js";
import { encryptPass } from "../utils/basic.js";
import { InternalServerError } from "../utils/error.js";
import log from "../utils/log.js";

export async function ensureAdminUser(): Promise<void> {
    let passHash = String(ENV.ADMIN_PASS_HASH || "").trim();

    if (!passHash) {
        const pass = String(ENV.ADMIN_PASSWORD || "");
        if (!pass) {
            throw new InternalServerError("Missing ADMIN_PASSWORD or ADMIN_PASS_HASH for admin bootstrap");
        }
        passHash = await encryptPass(pass);
        log.INFO("Admin password hash derived from ADMIN_PASSWORD");
    }

    const existing = await User.findOne({ email: ENV.ADMIN_EMAIL }).lean();
    if (existing) {
        const needsRole = existing.role !== "admin";
        const needsName = existing.username !==  ENV.ADMIN_USERNAME;

        if (needsRole || needsName) {
            await User.updateOne(
                { _id: existing._id },
                {
                    ...(needsRole ? { role: "admin" } : {}),
                    ...(needsName ? { username: ENV.ADMIN_USERNAME } : {}),
                }
            );
            log.INFO(`Admin user updated: ${ENV.ADMIN_EMAIL}`);
        } else {
            log.INFO(`Admin user exists: ${ENV.ADMIN_EMAIL}`);
        }
        return;
    }

    await User.create({
        username:     ENV.ADMIN_USERNAME,
        email:        ENV.ADMIN_EMAIL,
        passwordHash: passHash,
        role:         "admin",
    });

    log.INFO(`Admin user created: ${ENV.ADMIN_EMAIL}`);
}
