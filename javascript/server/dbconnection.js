var mysql = require('mysql');
var connection = mysql.createPool({
  host:'cmpe295.cxswepygqy9j.us-west-1.rds.amazonaws.com',
  user:'cmpe295',
  password:'cmpe295.sjsu.2018',
  database:'SP500'
});

module.exports = connection;
