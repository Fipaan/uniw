const express = require("express");
const { requireAuth } = require("../middleware/auth");
const { me } = require("../controllers/me.controller");

const router = express.Router();
router.get("/", requireAuth, me);

module.exports = { meRouter: router };
