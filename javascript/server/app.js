'use strict';

var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var compression = require('compression')
var logger = require('morgan');

var Stocks = require('./routes/Stocks');
var Symbols = require('./routes/Symbols');
var Predict = require('./routes/Predict');


var app = express();

// setup compression, use gzip to improve performance
app.use(compression())

// setup static access for html & css files
// NOTE: all files under static directory are public and can be viewed by anyone
app.use(express.static(path.join(__dirname, 'public')));

// allow cross origin
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.use(logger('dev')); // to support logging
app.use(express.json()); // to support JSON-encoded bodies
app.use(express.urlencoded({ extended: false })); // to support URL-encoded bodies
app.use(cookieParser()); // to support cookie
app.use(session({
  secret: 'cmpe295.Fall2018',
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 60000 }
})); // to support session, and setup session

// route --> page
app.use('/Stocks', Stocks);
app.use('/Symbols', Symbols);
app.use('/Predict', Predict);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.json(err);
});

module.exports = app;
