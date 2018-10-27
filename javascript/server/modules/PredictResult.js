var db = require('../dbconnection'); //reference of dbconnection.js

var PredictResult = {
    getPredictResult: function () {
        return [
            {label: "AMZN", amount: 5.65, result: 6},
            {label: "GOOG", amount: 4.39, result: 4},
            {label: "AAPL", amount: 3.72, result: 3},
            {label: "TSLA", amount: 2.14, result: 2},
            {label: "PYPL", amount: 1.25, result: 1},
            {label: "FB", amount: 4.62, result: -6},
            {label: "T", amount: 3.65, result: -4},
            {label: "BIDU", amount: 2.77, result: -3},
            {label: "TWTR", amount: 1.93, result: -2},
            {label: "PDD", amount: 0.25, result: -1},
        ];
    },
};

module.exports = PredictResult;
