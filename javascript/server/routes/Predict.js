var express = require('express');
var router = express.Router();
var Prediction = require('../APIs/Prediction');

router.get('/top', function (req, res) {
    Prediction.getTop(res);
});

router.get('/:table/:start_date/:end_date', function (req, res, next) {
    Prediction.getPredictionById(req.params.table, req.params.start_date, req.params.end_date, res);
});

router.get('/:table/latest', function(req, res, next) {
    Prediction.getLatest(req.params.table, res)
});

router.get('/:table/top5', function(req, res){
    Prediction.getTop5(req.params.table, res);
});

module.exports = router;