const dotenv = require("dotenv");
const mysql2 = require("mysql2");

dotenv.config();

const MySql2HttpCodeMap = Object.freeze({
    ER_TRUNCATED_WRONG_VALUE_FOR_FIELD: 422,
    ER_DUP_ENTRY: 409
});

class DB_Connection {
    constructor() {
        this.conn = mysql2.createPool({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASS,
            database: process.env.DB_DATABASE
        });

        this.testConnection();
    }

    testConnection() {
        this.conn.getConnection((err, connection) => {
            if (err) {
                // there are several reasons why an error might occurr during a server-database handshake
                switch(err.code) {
                    case "PROTOCOL_CONNECTION_LOST":
                        console.log("The connection to the database was destroyed.");
                        break;
                    case "ECONNREFUSED":
                        console.log("The connection to the database was refused.");
                        break;
                    case "ER_CON_COUNT_ERROR":
                        console.log(`The number of connections to the database has exceeded its limit.
                        Consider increasing the connection limit (default = 10) or optimizing your code.
                        `);
                        break;
                }
            }
            // if there's a connection, simply destroy it.
            if (connection) connection.release();
            return;
        });
    }

    query = async (sql, values) => {
        return new Promise((resolve, reject) => {
            const callback = (err, result) => {
                if (err) {
                    reject(err);
                    return;
                }
                resolve(result);
            }
            this.conn.execute(sql, values, callback);
        }).catch(err => {
            // create an array of possible errors that can occur in a query
            const errors = Object.keys(MySql2HttpCodeMap);
            // if <errors> includes the code for the error <err>, assign the corresponding error status code to
            // err.status. If it doesn't, leave err.status as it is.
            err.status = errors.includes(err.code) ? MySql2HttpCodeMap[err.code] : err.status;
            
            throw err;
        });
    }
}

module.exports = new DB_Connection().query;