const fs = require("fs");
const path = require("path");


class _Error {
    constructor() {
    }

    guard() {
        return process.on("unhandledRejection", (err, promise) => {
            this.log("#", `_Handler:>> Unhandled Promise Rejection[Promise: ${promise.toString()}|Error: '${err}]'`, 5);
        });
    }

    /**
     * 
     * @param {*} thrower the origin of the error. Best declared as '#/db/index.js', 
     * where '#' means the application root. Serves to help developers quickly locate
     * the source of the error
     * @param {*} error the error message to be logged
     * @param {*} severity a severity level based on the 'thrower' of the error
     * the severity can be determined by the developer
     * I usually use the following in my projects:
     * ======================
     * || 5: System-level errors: 
     * ||    errors that originate from the Node process (e.g unhandledRejection)
     * || 4: Services-based errors:
     * ||    errors that originate from services that the app depends on (e.g database connection errors)
    *  || 3: Code-defined errors:
    *  ||    errors that the might arise while executing a function (e.g a request body object containing parameters that fail a validation check and cannot be processed further)
    *  || 2: Client-originated errors:
    *  ||    errors that are caused by the client or user-agent (e.g attempting accessing an invalid route or accessing a route that the user-agent has no authorization for)
     * || 1: Errors that do not clearly fall into any of the other categories
     * ======================
     * It is important to note that these errors are not arranged in any order (order of severity or otherwise). Errors in Node processes are usually fatal and 
     * can cause bad UX for the application consumers. The _Error class tries to ensure that 
     * errors do not negatively impact teh system.
     */

    log(thrower, error, severity) {
        const logFilePath = path.join(__dirname, "../logs/errors.log.txt");
        const logMessage = 
`==============================================
        ERROR
Class: ${severity}
Time & Date: ${new Date().toLocaleString()}        
At: ${thrower}
Reason: ${error}
`;
        fs.appendFile(logFilePath, logMessage, err => { if (err) throw err });
        // throw new Error(error);
    }
}

module.exports = new _Error();