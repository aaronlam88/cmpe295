var mysql = require('mysql');
var db = require('../dbconnection'); //reference of dbconnection.js

var Stock = {
  getAllStocks:function(callback){
    return db.query("Select * from AAL", callback);
  },
  getStockById:function(table,start_date,end_date,callback){
    var sql = "SELECT * FROM ?? WHERE ?? >= ? AND ?? <= ?";
    var inserts = [table, 'Date', start_date, 'Date', end_date];
    sql = mysql.format(sql, inserts);

    console.log("query: ", sql);
    return db.query(sql, callback);
  },
};

module.exports = Stock;
