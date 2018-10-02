var express = require('express');
var router = express.Router();
var Stock = require('../modules/Stock');
var GetSymbol = require('../APIs/GetSymbols');

router.get('/:table/:start_date/:end_date', function (req, res, next) {
    Stock.getStockById(req.params.table, req.params.start_date, req.params.end_date, res);
});

router.get('/', function (req, res, next) {
    GetSymbol.getAllSymbols(res);
});

module.exports = router;
