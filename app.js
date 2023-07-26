var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const dotenv = require('dotenv');
const cors = require('cors')
const jwt = require('jsonwebtoken');
const session = require('express-session');

dotenv.config()

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
const tourplansRouter = require('./routes/tourplans');
const shareRouter = require('./routes/share');
const searchRouter = require('./routes/search');
//sprint
const sprintUserRouter = require('./routes/sprint_user');
const sprintBuddyRouter = require("./routes/buddy");

var app = express();
const corsOptions = {
  credentials : true,
  origin : ["http://localhost:5174", "http://localhost:5173"]
}
app.use(cors(corsOptions));
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

//middel ware
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
  secret: 'ouou',
  resave: false,
  saveUninitialized: false
}));
app.use(async (req, res, next) => {
  res.header('Access-Control-Allow-Credentials', true);
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, authorization'
  );
  res.header('Access-Control-Allow-Methods', 'GET,POST,DELETE,PUT,OPTIONS');
  res.header('Access-Control-Allow-Origin', req.headers.origin);
  next();
});
// app.use(jwt({
//   secret : process.env.JWT_SECRET_KEY,
//   getToken : req => req.cookies.token
// }))

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/tourplans', tourplansRouter);
app.use('/share', shareRouter);
app.use('/search', searchRouter);
app.use('/sprint/user', sprintUserRouter);
app.use('/sprint/buddy', sprintBuddyRouter);

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

module.exports = app;
