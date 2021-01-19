const express = require("express");
const route = express.Router();
const HttpClass = require("../../utils/Http.class");

const User_model = require("../../models/User_model");

route.get("/", async (req, res, next) => {
    const result = await User_model.find("user_id", 7933745585795561000);
    const Http = new HttpClass();
    Http.emit(res, 200, null, "User", result);
})

module.exports = route;