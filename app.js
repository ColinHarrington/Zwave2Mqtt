var express = require('express'),
reqlib = require('app-root-path').require,
path = require('path'),
logger = require('morgan'),
cookieParser = require('cookie-parser'),
bodyParser = require('body-parser'),
app = express(),
fs = require('fs'),
jsonfile = require('jsonfile'),
SerialPort = require('serialport'),
cors = require('cors'),
ZWaveClient = reqlib('/lib/ZwaveClient'),
uniqid = require('uniqid'),
utils = reqlib('/lib/utils.js');

console.log("Application path:", utils.getPath(true));

// view engine setup
app.set('views', utils.joinPath(utils.getPath(), 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(bodyParser.json({limit: "50mb"}));
app.use(bodyParser.urlencoded({limit: "50mb", extended: true, parameterLimit:50000}));
app.use(cookieParser());

app.use('/', express.static(utils.joinPath(utils.getPath(), 'dist')));

app.use(cors());

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  console.log(err);

  // render the error page
  res.status(err.status || 500);
  res.redirect('/');
});

var options = {port: '/dev/ttyACM0', logging: 'off', saveConfig: true};

var client = new ZWaveClient(options);

process.on('SIGINT', function(){
  client.close();
});

module.exports = app;
