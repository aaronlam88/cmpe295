var express = require('express');
var router = express.Router();
var Stock = require('../modules/Stock');

router.get('/:table/:start_date/:end_date',function(req,res,next){
  Stock.getStockById(req.params.table,req.params.start_date,req.params.end_date,function(err,rows){
    console.log("req.params.id: ", req.params.table);
    if (err) {
      res.json(err);
    } else {
      res.json(rows);
    }
  });
});

router.get('/', function(req,res,next) {
  Stock.getAllStocks(function(err,rows) {
    if (err) {
      res.json(err);
    } else {
      res.json(rows);
    }
  });
});

module.exports = router;
