const express = require("express");
const route = express.Router();
const User = require("../../controllers/User");
const HttpClass = require("../../utils/Http.class");

// routes
route.post("/", (req, res, next) => {
    console.log(req.body);
    res.send(req.body);
})

module.exports = route;