var express = require('express');
var router = express.Router();
var Stock = require('../APIs/Stock');

router.get('/top', function (req, res) {
    Stock.getTop(res);
})

module.exports = router;