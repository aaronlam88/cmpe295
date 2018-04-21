var db = require('../dbconnection'); //reference of dbconnection.js
var cache = require('../cache/cache.js');

var Stock = {
    getStockById: function (table, start_date, end_date, res) {
        let q = `SELECT * FROM ${table} WHERE Date >= ${start_date} AND Date <= ${end_date} ORDER BY Date DESC`
        console.log("query: ", q);

        let cachedResult = cache.get(q)
        if (cachedResult) {
            console.log("Return cached result");
            res.json(cachedResult);
        } else {
            var result = db.query(q, function (err, result, fields) {
                if (err) {
                    res.json(err);
                } else {
                    console.log("Save result to cache");
                    cache.set(q, result);
                    res.json(result);
                }
            });
        }
    },
};

module.exports = Stock;
