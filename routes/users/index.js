const express = require("express");
const route = express.Router();
const User = require("../../controllers/User");
const HttpClass = require("../../utils/Http.class");

/**
 * Route: Sign Up
 */
route.put("/", async (req, res, next) => {
    const Http = new HttpClass();
    Http.log(req, "req");
    const result = await User.signup(req.body);
    Http.emit(res, ...result);
});

/**
 * Route: Sign In
 */
route.post("/", async (req, res, next) => {
    const Http = new HttpClass();
    Http.log(req, "req");
    const result = await User.signin(req.body);
    Http.emit(res, ...result);
});

module.exports = route;