var db = require('../library/dbconnection'); //reference of dbconnection.js
var cache = require('../library/cache');

var Stock = (function () {
    function getStockById(table, start_date, end_date, res) {
        let q = `SELECT * FROM ${table} WHERE Date >= '${start_date}' AND Date <= '${end_date}' ORDER BY Date DESC;`
        console.log("query: ", q);
        if (cache.has(q)) {
            console.log('hit cache');
            res.json(cache.get(q));
        } else {
            db.query(q, function (err, result, fields) {
                if (err) {
                    res.json(err);
                } else {
                    cache.set(q, result);
                    res.json(result);
                }
            });
        }

    }

    function getTop(res) {
        res.json(
            [
                { label: "AMZN", result: 6 },
                { label: "GOOG", result: 4 },
                { label: "AAPL", result: 3 },
                { label: "TSLA", result: 2 },
                { label: "PYPL", result: 1 },
                { label: "FB", result: -6 },
                { label: "T", result: -4 },
                { label: "BIDU", result: -3 },
                { label: "TWTR", result: -2 },
                { label: "PDD", result: -1 },
            ]
        );
    }

    // expose functions or variables in the return
    // ==> make functions or variables in the return public
    return {
        getStockById: getStockById,
        getTop: getTop,
    }
})();

module.exports = Stock;
