// var db = require('../library/predictiondb'); //reference of predictiondb.js
var mysql = require('mysql');
var cache = require('../library/cache');

var Prediction = (function () {
    var predictionConnection = mysql.createPool({
        "user": "cmpe295",
        "password": "cmpe295.sjsu.2018",
        "host": "stockdatabase.cxswepygqy9j.us-west-1.rds.amazonaws.com",
        database: 'PredictionDatabase',
        dateStrings: true
    });

    /*
    * example: http://localhost:8081/Predict/GOOG/20181112/20181121
    * [
    * {"Date":"2018-11-16 00:00:00","DTree":1,"SVM":0,"SGDLinear":0,"SGDRegression":-33924368239540.305,"LASSORegression":1058.6251924196856},
    * {"Date":"2018-11-15 00:00:00","DTree":0,"SVM":0,"SGDLinear":0,"SGDRegression":-33540837479602.82,"LASSORegression":1056.375909863339},
    * {"Date":"2018-11-14 00:00:00","DTree":0,"SVM":0,"SGDLinear":0,"SGDRegression":-33475034013078.4,"LASSORegression":1043.0930812316162},
    * {"Date":"2018-11-13 00:00:00","DTree":0,"SVM":0,"SGDLinear":0,"SGDRegression":-33417228092627.6,"LASSORegression":1045.69616019958},
    * {"Date":"2018-11-12 00:00:00","DTree":1,"SVM":0,"SGDLinear":0,"SGDRegression":-33646793315375.812,"LASSORegression":1046.3033048127943}]
    * */

    function getPredictionById(table, start_date, end_date, res) {
        let q = `SELECT * FROM ${table} WHERE Date >= '${start_date}' AND Date <= '${end_date}' ORDER BY Date;`;
        // console.log("query: ", q);
        if (cache.has('predict' + q)) {
            console.log('hit cache');
            res.json(cache.get('predict' + q));
        } else {
            predictionConnection.query(q, function (err, result, fields) {
                if (err) {
                    res.json(err);
                } else {
                    cache.set('predict' + q, result);
                    res.json(result);
                }
            });
        }
    }

    /*
    * http://localhost:8081/Predict/GOOG/latest
    * [{"Date":"2018-11-16 00:00:00","DTree":1,"SVM":0,"SGDLinear":0,"SGDRegression":-33924368239540.305,"LASSORegression":1058.6251924196856}]
    * */

    function getLatest(table, res) {
        let q = `SELECT * FROM ${table} ORDER BY Date DESC LIMIT 1;`;
        // console.log("query: ", q);
        if (cache.has('predict' + q)) {
            console.log('hit cache');
            res.json(cache.get('predict' + q));
        } else {
            predictionConnection.query(q, function (err, result, fields) {
                if (err) {
                    res.json(err);
                } else {
                    cache.set('predict' + q, result);
                    res.json(result);
                }
            });
        }
    }


    /* json format
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
                {label: "AMZN", amount: 5.65, result: 6},
                {label: "GOOG", amount: 4.39, result: 4},
                {label: "AAPL", amount: 3.72, result: 3},
                {label: "TSLA", amount: 2.14, result: 2},
                {label: "PYPL", amount: 0, result: 0.0},
                {label: "FB", amount: 4.62, result: -6},
                {label: "T", amount: 3.65, result: -4},
                {label: "BIDU", amount: 2.77, result: -3},
                {label: "TWTR", amount: 1.93, result: -2},
                {label: "PDD", amount: 0.25, result: -1},

                {label: "AAPL", amount: 5.44, result: 5.2},
                {label: "PYPL", amount: 4.87, result: 4.3},
                {label: "AMZN", amount: 3.69, result: 3.7},
                {label: "TSLA", amount: 2.98, result: 2.8},
                {label: "GOOG", amount: 1.73, result: 1.2},
                {label: "T", amount: 4.82, result: -5.33},
                {label: "TWTR", amount: 3.93, result: -4.2},
                {label: "PDD", amount: 2.69, result: -3.2},
                {label: "FB", amount: 1.88, result: -2.4},
                {label: "BIDU", amount: 1.25, result: -1.33},

                {result: 1},
                {result: 0},
                {result: 1},
            ]
        );
    }

    // expose functions or variables in the return
    // ==> make functions or variables in the return public
    return {
        getPredictionById: getPredictionById,
        getLatest: getLatest,
        getTop: getTop,
    }
})();

module.exports = Prediction;
