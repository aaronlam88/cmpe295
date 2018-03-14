var db = require('../dbconnection'); //reference of dbconnection.js

var Stock = {
  getAllStocks:function(callback){
    return db.query("Select * from AAL", callback);
  },
  getStockById:function(table,start_date,end_date,callback){
    let q = "SELECT * FROM " + table + " WHERE Date >= '" + start_date + "' AND Date <= '" + end_date + "'"
    console.log("query: ", q);
    return db.query(q, callback);
  },
};

module.exports = Stock;
