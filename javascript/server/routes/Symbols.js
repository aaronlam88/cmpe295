var express = require('express');
var router = express.Router();
var Symbol = require('../APIs/Symbols');

router.get('/', function (req, res, next) {
    Symbol.getAllSymbols(res);
});

module.exports = router;