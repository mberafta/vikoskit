require('dotenv').load();
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var passport = require('passport');
var mongoose = require('mongoose');
var utf8 = require('utf8');
var base64 = require('base-64');
var toUint8Array = require('base64-to-uint8array')

const url = "mongodb://mikaviko:nilmar69@ds131687.mlab.com:31687/mberafta-db";
const localUri = "mongodb://localhost/mbapp";

mongoose.connect(localUri, { useMongoClient: true });

mongoose.connection.on('connected', function () {
  console.log("Connection à la base établie ...");
});

mongoose.connection.on('error', function (err) {
  //console.log(err);
});

var app = module.exports = express();

// view engine setup
app.set('views', path.join(__dirname, 'public'));
app.set('view engine', 'html');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(logger('dev'));
app.use(passport.initialize());
app.use(passport.session());
require('./routes/index')(app);

// // -------------------------------- //
// let str = 'ESC';
// let b64 = base64.encode(str);
// let decoded = base64.decode(b64);
// let buffer = new Buffer(str, 'base64');
// let strHex = Buffer.from(str).toString('hex');
// let hex = Buffer.from(b64).toString('hex');
// let uint8array = toUint8Array(b64);
// let utf8_from_b64 = new Buffer(b64, 'base64').toString('utf8');
// let b64_buffer = new Buffer(b64, 'base64');

// let data = Buffer.from([0xca]);

// console.log('base 64 de ESC : ', b64);
// console.log('base 64 de ESC décodée : ', decoded);
// console.log('base 64 DE ESC en hex : ', hex);
// console.log('ESC en hex : ', strHex);
// console.log('buffer ESC : ', buffer);
// console.log('base 64 de ESC en uint8 : ', uint8array);
// console.log('ESC en uint8 : ', toUint8Array(str));
// console.log('ESC hexadecimal en uint8 : ', toUint8Array(strHex));
// console.log('base 64 de ESC hexadecimal en uint8 : ', toUint8Array(hex));
// console.log('base 64 de ESC en utf8 : ', utf8_from_b64);
// console.log('base 64 de ESC en buffer : ', b64_buffer);
// console.log(buffer.toString('ascii'));

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});
