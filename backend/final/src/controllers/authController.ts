import type { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import ms from "ms";
import { ENV } from "../config/env.js";
import { UserRole, getUserRole, User } from "../models/User.js";
import {
    BadRequestError,
    UnauthorizedError,
    InternalServerError,
} from "../utils/error.js";
import { encryptPass } from "../utils/basic.js";

function signToken(userId: string, role: UserRole) {
    return jwt.sign({
        sub: userId,
        role,
    }, ENV.JWT_SECRET, {
        expiresIn: ENV.JWT_EXPIRES_IN,
    });
}

export default {
    register: async (req: Request, res: Response) => {
        const { username, email, password } = req.body;
    
        const exists = await User.findOne({ email }).lean();
        if (exists) throw new BadRequestError("Email already in use");
    
        const passwordHash = await encryptPass(password);
        await User.create({ username, email, passwordHash, role: "user" });
    
        return res.status(201).json({ status: "OK" });
    },

    login: async (req: Request, res: Response) => {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) throw new UnauthorizedError("Invalid credentials");

        const ok = await bcrypt.compare(password, user.passwordHash);
        if (!ok) throw new UnauthorizedError("Invalid credentials");

        const role = getUserRole(user.role);
        if (role === undefined) throw new InternalServerError(`Role ${String(user.role)} is unknown`);

        const id = String(user._id);
        const token = signToken(id, role);

        res.cookie(ENV.JWT_COOKIE_NAME, token, {
            httpOnly: true,
            secure: ENV.NODE_ENV === "production",
            sameSite: "lax",
            path: "/",
            maxAge: ms(ENV.JWT_EXPIRES_IN),
        });

        return res.status(200).json({
            status: "OK",
            user: {
                id,
                username: user.username,
                email: user.email,
                role,
            },
        });
    },

    logout: async (_req: Request, res: Response) => {
        res.clearCookie(ENV.JWT_COOKIE_NAME, {
            httpOnly: true,
            secure: ENV.NODE_ENV === "production",
            sameSite: "lax",
            path: "/",
        });

        return res.status(200).json({ status: "OK" });
    },
    
    status: async (req: Request, res: Response) => {
        return res.json({ status: "OK" });
    },
}
