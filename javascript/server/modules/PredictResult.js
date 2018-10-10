var db = require('../dbconnection'); //reference of dbconnection.js

var PredictResult = {
    getPredictResult: function () {
      return [
        {label: "AMZN", result: "6%"},
        {label: "GOOG", result: "4%"},
        {label: "AAPL", result: "3%"},
        {label: "TSLA", result: "2%"},
        {label: "PYPL", result: "1%"},
        {label: "FB", result: "-6%"},
        {label: "T", result: "-4%"},
        {label: "BIDU", result: "-3%"},
        {label: "TWTR", result: "-2%"},
        {label: "PDD", result: "-1%"},
      ];
    },
};

module.exports = PredictResult;
