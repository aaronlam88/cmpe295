var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var cors = require('cors');
var Stocks = require('./routes/Stocks');
var getSymbols = require('./routes/GetSymbols');
var app = express();

var port = 9081;

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/Stocks', Stocks);
app.use('/getSymbols', getSymbols);

app.listen(port, function(){
  console.log("app started...");
})
