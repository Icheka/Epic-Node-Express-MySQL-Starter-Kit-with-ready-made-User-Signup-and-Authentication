const conn = require("../db/index");
const Tables = require("../db/tables.js");



class Estate_model {
    async findEstate(estate_id) {
        let SQL = `SELECT * FROM ${Tables.estates} WHERE estate_id = ?`;
        let VALUE = [estate_id];
        return await conn(SQL, VALUE);
    }


}

module.exports = {
    findEstate: new Estate_model().findEstate
}