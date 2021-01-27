const _handler = require("../_handlers/index");
const HttpClass = require("../utils/Http.class");
const { findEstate } = require("../models/Estate_model");


class Estate {
    // utils
    async findEstate(estate_id) {
        return await findEstate(estate_id);
    }





    // ===========================
}

module.exports = new Estate();