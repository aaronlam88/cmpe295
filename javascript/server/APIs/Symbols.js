var db = require('../library/dbconnection'); //reference of dbconnection.js
var cache = require('../library/cache');

var Symbols = (function () {
    function getAllSymbols(res) {
        let table = '4update';
        let q = `SELECT Symbol FROM ${table};`
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

    // expose functions or variables in the return
    // ==> make functions or variables in the return public
    return {
        getAllSymbols: getAllSymbols,
    }
})();

module.exports = Symbols;
