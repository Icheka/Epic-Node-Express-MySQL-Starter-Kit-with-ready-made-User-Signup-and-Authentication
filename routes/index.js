var express = require('express');
const HttpClass=require('../utils/Http.class');
var router = express.Router();
const conn = require("../db/index");

/* GET home page. */
router.get('/', async function (req, res, next) {
  res.render('index', { title: 'E?xpress' });
});

module.exports = router;
