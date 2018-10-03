var express = require('express');
var router = express.Router();
var GetSymbol = require('../APIs/GetSymbols');

router.get('/', function (req, res, next) {
    GetSymbol.getAllSymbols(res);
});

module.exports = router;