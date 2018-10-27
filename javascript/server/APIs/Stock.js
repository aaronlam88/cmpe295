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


    /* jason format
    1. 10 result from algorithm 1 (5 top gainer + 5 top loser)：
        result format {label: String, amount: double, result: double}
    2. 10 result from algorithm 2 (5 top gainer + 5 top loser)：
        result format {label: String, amount: double, result: double}
    3. 1 result from algorithm 3 (only predict go higher or lower without number) :
        result format: {result: boolean} or {result: int}
    4. 1 result from algorithm 4 (only predict go higher or lower without number) :
        result format: {result: boolean} or {result: int}
    */

    function getTop(res) {
        res.json(
            [
                { label: "AMZN", amount:5.65, result: 6 },
                { label: "GOOG", amount:4.39, result: 4 },
                { label: "AAPL", amount:3.72, result: 3 },
                { label: "TSLA", amount:2.14, result: 2 },
                { label: "PYPL", amount:1.25, result: 1 },
                { label: "FB", amount:4.62, result: -6 },
                { label: "T", amount:3.65, result: -4 },
                { label: "BIDU", amount:2.77, result: -3 },
                { label: "TWTR", amount:1.93, result: -2 },
                { label: "PDD", amount:0.25, result: -1 },
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
