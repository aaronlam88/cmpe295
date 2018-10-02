var db = require('../dbconnection'); //reference of dbconnection.js

var Stock = {
    getStockById: function (table, start_date, end_date, res) {
        let q = `SELECT * FROM ${table} WHERE Date >= '${start_date}' AND Date <= '${end_date}' ORDER BY Date DESC`
        console.log("query: ", q);

        var result = db.query(q, function (err, result, fields) {
            if (err) {
                res.json(err);
            } else {
                console.log("Save result to cache");
                res.json(result);
            }
        });   
    },
};

module.exports = Stock;
