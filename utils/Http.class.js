const express = require("express");
const fs = require("fs");
const path = require("path");

class HTTPError {
    constructor() {
        this.incoming_Message = "Incoming";
        this.outgoing_Message = "Outgoing";
    }

    emit(res, status_code, header, message, data=null) {
        
        const headers = {
            200: "Successful",
            500: "Internal Server Error",
            404: "Resource Not Found",
            406: "Unacceptable Parameters In Request Body",
            400: "Malformed Request",
            401: "Unauthorized: Bearer token verification failed"
        }

        const headers_array = Object.keys(headers);

        header = header == null ? (
            headers_array.includes(status_code.toString(10)) ? headers[status_code] : "No header given"
        ) : header;

        this.header = header;
        this.message = message;

        if (data !== null) {
            res.status(status_code).send({
                header, message, data
            });
        } else {
            res.status(status_code).send({
                header, message
            });
        }

        this.log(null, res);
    }

    log(req, res="Incoming") {

        const ip = req !== null ? req.headers['x-forwarded-for'] || req.connection.remoteAddress : this.outgoing_Message;

        req = req == null ? {
            originalUrl: this.outgoing_Message,
            method: this.outgoing_Message,
            body: this.outgoing_Message
        } : req;

        const logFilePath = path.join(__dirname, "../logs/req_res.logs.txt");
        const logMessage = `
==============================
Time & Date: ${new Date().toLocaleString()}
Request:
        IP Address: ${ip}
        To: ${req.originalUrl}
        Method: ${req.method}
        Body: ${JSON.stringify(req.body)}
Response:
        Status Code: ${JSON.stringify(res.status) || "200 OK"}
        Body: ${JSON.stringify(res.body) || "No Body"}
==============================`;

        fs.appendFile(logFilePath, logMessage, err => {if (err) throw err});
    }
}

module.exports = HTTPError;