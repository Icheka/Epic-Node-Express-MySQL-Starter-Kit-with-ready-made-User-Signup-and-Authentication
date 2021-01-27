const router = require("express").Router();
const Plot = require("../../controllers/Plot");
const HttpClass = require("../../utils/Http.class");

function send(res, status_code, header, message, data=null) {
    const Http = new HttpClass();
    return Http.emit(res, status_code, header, message, data);
}

// get information about one plot
router.get('/:estate_id/:id', async (req, res, next) => {
    let obj = await Plot.listOnePlot(req.params.estate_id, req.params.id);

    return send(res, ...obj);
})

// get information on every plot in an estate
router.get("/:estate_id", async (req, res, next) => {
    let obj = await Plot.listAllPlots(req.params.estate_id);

    return send(res, ...obj);
});

module.exports = router;