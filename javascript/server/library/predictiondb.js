var mysql = require('mysql');

let config = require('../../../ignore/db_config.json');

var predictionConnection = mysql.createPool({
  host: config.host,
  user: config.username,
  password: config.password,
  database: 'PredictionDatabase',
  dateStrings: true
});

module.exports = predictionConnection;
