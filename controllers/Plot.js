const _handler = require("../_handlers/index");
const HttpClass = require("../utils/Http.class");
const { listAll, listOne, getPlotImages } = require("../models/Plot_model");
const Estate = require("./Estate");

class Plot {
    async listAllPlots(estate_id) {
        let result = await listAll(estate_id);

        return [200, null, "All Plots", result];
    }

    async listOnePlot(estate_id, plot_id) {
        let estate = await Estate.findEstate(estate_id);
        if (estate.length == 0) {
            return [404, "Estate Not Found", "No estate with that ID exists."];
        }

        let plots = await listOne(estate_id, plot_id);
        if (plots.length == 0) return [404, "Plot Not Found", `No plot with that ID exists in that estate {${estate_id}}`];

        let plot_images = await getPlotImages(plot_id);
        let plotImagesAndOrders = [];
        Object.values(plot_images).forEach(image => plotImagesAndOrders.push({ url: image.images_url, order: image.image_order }));

        plots[0].plot_images = plotImagesAndOrders;

        return [200, null, "Plot Details", plots[0]];
    }
}

module.exports = new Plot();