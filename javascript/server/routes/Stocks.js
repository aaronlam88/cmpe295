var express = require('express');
var router = express.Router();
var Stock = require('../modules/Stock');

router.get('/:table/:start_date/:end_date', function (req, res, next) {
    Stock.getStockById(req.params.table, req.params.start_date, req.params.end_date, res);
});

module.exports = router;
