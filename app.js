var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var sassMiddleware = require('node-sass-middleware');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

var config = require('./config');
var fn_exc = require('./fn_exc');

var http = require('http').Server(app);
var io = require('socket.io')(http);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(sassMiddleware({
  src: path.join(__dirname, 'public'),
  dest: path.join(__dirname, 'public'),
  indentedSyntax: true, // true = .sass and false = .scss
  sourceMap: true
}));
app.use(express.static(path.join(__dirname, 'public')));

// Routers
app.use('/', indexRouter);
app.use('/create', indexRouter);
app.use('/edit/:id', indexRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});



var userCount = 0;
var users = {};
io.on('connection', function(socket) {

    userCount++;
    console.log("[Connected] : Socket ID : " + socket.id + "( " + userCount + " )");
    users[socket.id.toLowerCase()] = { socket_id : socket.id };

    io.emit("user online", users);

  socket.on('send server', function(obj, fn) {
      fn_exc.exc(obj.c, obj.w, obj.m, function(obj) {
        return (fn)(obj);
      });

  });


  socket.on('disconnect', function(){
      userCount--;
      delete users[socket.id.toLowerCase()];
      console.log("[Disconnected] : Socket ID : " + socket.id + "( " + userCount + " )");

      io.emit("user online", users);
  });

});

//module.exports = app;

http.listen(config.port, function () {
    console.log('listening on *:' + config.port);
});