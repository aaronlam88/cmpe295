var db = require('../dbconnection'); //reference of dbconnection.js

var Task = {
  getAllTasks:function(callback){
    return db.query("Select * from AAL", callback);
  }
};

module.exports = Task;
