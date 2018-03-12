var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var cors=require('cors');
var Tasks=require('./routes/Tasks');
var app = express();


// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/Tasks',Tasks);

app.listen(3000, function(){
  console.log("shuzhong debug");
})
