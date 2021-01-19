const express = require("express");
const route = express.Router();
const HttpClass = require('./Http.class');

route.all("*", (req, res, next) => {
    const err_response = {
        "header": "Route Not Found",
        "message": `The route ${req.originalUrl} does not exist on the server.`
    }

    Http = new HttpClass();
    Http.emit(res, 404, null, "The route does not exist on the server");
    Http.log(req);
});

module.exports = route;