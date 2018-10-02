var db = require('../dbconnection'); //reference of dbconnection.js

var GetSymbols = {
    getStockById: function () {
        let table = '4update';
        let q = `SELECT Symbol FROM ${table}`
        console.log("query: ", q);
        var result = db.query(q, function (err, result) {
            if (err) {
                res.json(err);
            } else {
                res.json(result);
            }
        });    
    },
};

module.exports = GetSymbols;