const conn = require("../db/index");
const Tables = require("../db/tables.js");

class Plot_model {
    async listAll(estate_id) {
        let SQL = `SELECT * FROM ${Tables.plots} WHERE estate_id = ?`;
        let VALUE = [estate_id];

        return await conn(SQL, VALUE);
    }

    async listOne(estate_id, plot_id) {
        let SQL = `SELECT * FROM ${Tables.plots} WHERE estate_id = ? and plot_id = ?`;
        let VALUES = [estate_id, plot_id];
        
        return await conn(SQL, VALUES);
    }

    async getPlotImages(plot_id) {
        let SQL = `SELECT * FROM ${Tables.plot_images} WHERE plot_id = ?`;
        let VALUE = [plot_id];

        return await conn(SQL, VALUE);
    }
}

module.exports = {
    listAll: new Plot_model().listAll,
    listOne: new Plot_model().listOne,
    getPlotImages: new Plot_model().getPlotImages
}