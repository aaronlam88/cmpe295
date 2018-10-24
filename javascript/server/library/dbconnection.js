var mysql = require('mysql');

let config = require('../../../ignore/db_config.json');

var connection = mysql.createPool({
  host: config.host,
  user: config.username,
  password: config.password,
  database: config.database,
  dateStrings: true
});

module.exports = connection;
