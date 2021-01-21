const conn = require("../db/index");
const Tables = require("../db/tables.js");


class Person_model {
    constructor(role) {
        this.role = role;
    }

    /**
     * 
     * @find(string param, string|number value): object
     * Finds and returns a user by a parameter (e.g email or phone number, passed as a string or integer)
     * @param {*} value 
     */
    async find(param, value, role) {
        let sql = `SELECT * FROM ${Tables[role]} WHERE ${param} = ?`;
        let values = [value];
        return await conn(sql, values);
    }


}

module.exports = Person_model;