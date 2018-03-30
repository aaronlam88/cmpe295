var db = require('../dbconnection'); //reference of dbconnection.js
var cache = require('../cache/cache.js');

var Stock = {
  getStockById:function(table,start_date,end_date,callback){
    let q = "SELECT * FROM " + table + " WHERE Date >= '" + start_date + " 00:00:00' AND Date <= '" + end_date + " 00:00:00'"
    console.log("query: ", q);

    if (cache.get(q)) {
    	console.log("call cache functions");
    	return cache.get(q);
    } else {
    	console.log("save values to cache");
        var result = db.query(q, callback);
    	cache.set(q, result);
    	return result;
    }
  },
};

module.exports = Stock;
