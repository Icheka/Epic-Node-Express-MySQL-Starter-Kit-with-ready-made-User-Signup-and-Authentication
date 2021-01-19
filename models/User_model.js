const conn = require("../db/index");
const Tables = require("../db/tables.js");

class User_model {


    async find(param, value) {
        let sql = `SELECT * FROM ${Tables.users} WHERE ${param} = ?`;
        let values = [value];
        const obj = await conn(sql, values);
        return obj;
    }
}

module.exports = {
    find: new User_model().find
}