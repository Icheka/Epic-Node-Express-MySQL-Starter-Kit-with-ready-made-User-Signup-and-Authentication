const express = require("express");
const router = express.Router();
const User = require("../../controllers/User");
const HttpClass = require("../../utils/Http.class");

/**
 * Route: Sign Up
 */
router.put("/", async (req, res, next) => {
    const Http = new HttpClass();
    Http.log(req, "req");
    const result = await User.signup(req.body);
    Http.emit(res, ...result);
});

/**
 * Route: Sign In
 */
router.post("/", async (req, res, next) => {
    const Http = new HttpClass();
    Http.log(req, "req");
    const result = await User.signin(req.body);
    Http.emit(res, ...result);
});

module.exports = router;