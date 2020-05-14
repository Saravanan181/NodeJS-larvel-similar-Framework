var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var morgan = require('morgan');
const jwt = require("jsonwebtoken");
var logconf = require('./config/logconf');

//middleware
var middleware = require('./middleware/reqresmiddleware');
var http = require('http');

//routes - controller
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var enDecryptRouter = require('./routes/endecrypt');
var keyinfoRouter = require('./routes/keyinfo');
var logRouter = require('./routes/logaccess');



//models
var userModel = require('./models/users');

var app = express();
var server = http.createServer(app);

// const errorLog = require('./config/log').errorlog;
// const successlog = require('./config/log').successlog;


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(morgan('combined'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


// app.use('/',authenticateToken, indexRouter);


// users details
app.use('/users',authenticateToken,middleware.afterrequest, usersRouter, middleware.beforeresponse);
app.use('/keyinfo',authenticateToken,middleware.afterrequest, keyinfoRouter, middleware.beforeresponse);

//keyinfo details




app.use('/crypt',enDecryptRouter);
app.use('/log',logRouter);

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


function authenticateToken(req, res, next) {

// console.log(req.path);
    if(req.path == '/login'){
        next()
    }else{

        // console.log(req.headers);
        if(!req.headers['authorization']){
            res.sendData  = {"msg":"Token Missing","statuscode":403};
            middleware.beforeresponse(req,res);
        }
        //
        const authHeader = req.headers['authorization'];
        //
        const token = authHeader && authHeader.split(' ')[1];
        if (token == null){
            res.sendData  = {msg:"Authentication Not present",status_code:401};
            middleware.beforeresponse(req,res);
        }

        jwt.verify(token, 'nodeethos576asdas6', (err, user) => {
            if (err){
                res.sendData  = {"msg":"Invalid Token","statuscode":403};
                middleware.beforeresponse(req,res);
            }else{

                userModel.validateUser(user,req,res,function(userDetails){
                    if(userDetails[0].email_id===user.username){
                        next();
                    }else{
                        res.sendData  = {"msg":"Invalid User","statuscode":401};
                        middleware.beforeresponse(req,res);
                    }
                });

            }
        // pass the execution off to whatever request the client intended
    });

    }

}

server.listen(3000);
server.on('listening', function() {
    console.log('Server started on port %s at %s', server.address().port, server.address().address);
});

module.exports = app;
