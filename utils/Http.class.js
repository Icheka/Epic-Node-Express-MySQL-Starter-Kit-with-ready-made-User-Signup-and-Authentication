const express = require("express");
const fs = require("fs");
const path = require("path");
require("dotenv").config();

class _HTTPClass {
    constructor() {
        this.incoming_Message = "Incoming";
        this.outgoing_Message = "Outgoing";
    }

    /**
     * emit(string res, string status_code, string header, string message): void
     * 
     * @param {*string} res 
     * @param {*string} status_code 
     * @param {string} header 
     * @param {*string} message 
     * @param {} data 
     */
    emit(res, status_code, header, message, data=null) {
        
        const headers = {
            200: "Successful",
            500: "Internal Server Error",
            404: "Resource Not Found",
            406: "Unacceptable Parameters In Request Body",
            400: "Malformed Request",
            401: "Unauthorized: Bearer token verification failed",
            409: "Conflict"
        }

        const headers_array = Object.keys(headers);

        header = header == null ? (
            headers_array.includes(status_code.toString(10)) ? headers[status_code] : "No header given"
        ) : header;

        this.header = header;
        this.message = message;

        let payload;
        if (data !== null) {
            payload = { header, message, data }
            res.status(status_code).send(payload);
        } else {
            payload = { header, message };
            res.status(status_code).send(payload);
            payload.status = status_code;
        }

        this.log(payload, "res");
    }

    log(obj, type) {
        if (type == undefined) {
            throw new Error("<type> cannot be undefined!");
            return;
        }
        if (typeof obj !== 'object') {
            throw new Error("<type> cannot be a non-object!");
            return;
        }

        type = type.toLowerCase();

        if (type == "req") {
            var logFilePath = process.env.REQUEST_LOG_PATH || path.join(__dirname, "../logs/req_res.logs.txt");
            const ip = obj.headers['x-forwarded-for'] || obj.connection.remoteAddress;
            var logMessage = 
`==============================
Time & Date: ${new Date().toLocaleString()}
Request:
        IP Address: ${ip}
        To: ${obj.originalUrl}
        Method: ${obj.method}
        Body: ${JSON.stringify(obj.body)}
`
        } else if (type == "res") {
            var logFilePath = process.env.RESPONSE_LOG_PATH || path.join(__dirname, "../logs/req_res.logs.txt");
            var logMessage = 
`==============================
Response:
    Status Code: ${JSON.stringify(obj.status) || "200 OK"}
    Body: ${JSON.stringify(obj) || "No Body"}    
`
        } else {
            throw new Error("<type> must be either a <request> object or a <response> object!");
            return;
        }

        fs.appendFile(logFilePath, logMessage, err => {if (err) throw err});
    }
}

module.exports = _HTTPClass;