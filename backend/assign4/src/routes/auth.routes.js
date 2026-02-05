const express = require("express");
const { body } = require("express-validator");
const { validate } = require("../middleware/validate");
const { authLimiter } = require("../middleware/rateLimit");
const { register, login, logout, refresh } = require("../controllers/auth.controller");

const router = express.Router();

router.post(
    "/register",
    authLimiter,
    body("username").isString().trim().isLength({ min: 3, max: 32 }),
    body("password").isString().isLength({ min: 6, max: 128 }),
    validate,
    register
);

router.post(
    "/login",
    authLimiter,
    body("username").isString().trim().isLength({ min: 3, max: 32 }),
    body("password").isString().isLength({ min: 6, max: 128 }),
    validate,
    login
);

router.post("/logout", authLimiter, logout);
router.post("/refresh", authLimiter, refresh);

module.exports = { authRouter: router };
