const conn = require("../db/index");
const Tables = require("../db/tables.js");
const Person_model = require('./Person.abstract.model');

class User_model extends Person_model {
    constructor() {
        super("user");
        this.role = "user";
    }

    async signup(obj) {
        let VALUES = [];
        Object.values(obj).forEach(param => VALUES.push(param));

        let SQL = `INSERT INTO ${Tables.user} (`;
        Object.keys(obj).forEach(key => {
            SQL += `${key},`;
        });
        SQL = SQL.slice(0, -1);

        SQL += ") VALUES (";

        VALUES.forEach(v => SQL += "?, ");
        SQL = SQL.slice(0, -2);
        SQL += ")";

        // return SQL;
        return await conn(SQL, VALUES);
    }
}

module.exports = {
    find: new User_model().find,
    signup: new User_model().signup
}