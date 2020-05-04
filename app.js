var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const jwt = require("jsonwebtoken");

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var enDecryptRouter = require('./routes/endecrypt');
var keyinfoRouter = require('./routes/keyinfo');

var app = express();

var crypt = require("./endecrypt/crypt");


//middleware decrypt before passing to controller
var middlewarebeforerequest = function (req, res, next) {

    if(req.body.data){
        var data = req.body.data;
        crypt.decrypt(data,function(decrypted){
            req.body.data = JSON.parse(decrypted);
            next()
        });
    }else{
        next()
    }

}

//middleware encrypt before passing to response
var middlewareafterrequest = function (req, res) {

    var data = res.sendData;res.sendData = '';
    var statuscode = data.statuscode;

    crypt.encrypt(JSON.stringify(data),function(encryptData){
        res.status(statuscode).json({"data":encryptData});
    });

}


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger("AppServer"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


// app.use('/',authenticateToken, indexRouter);


// users details
app.use('/users',authenticateToken,middlewarebeforerequest, usersRouter, middlewareafterrequest);
app.use('/keyinfo',authenticateToken,middlewarebeforerequest, usersRouter, middlewareafterrequest);

//keyinfo details




app.use('/crypt',enDecryptRouter);

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

        // Gather the jwt access token from the request header
        var Userinfo = {msg:"Authentication Not present",status_code:401};

        if(!req.headers['authorization']){
            res.json({"msg":"Token Missing","statuscode":403});
        }
        //
        const authHeader = req.headers['authorization'];

        if(authHeader==''){
            res.json({"msg":"Token Missing","statuscode":403});
        }
        //
        const token = authHeader && authHeader.split(' ')[1];
        if (token == null){
            var Userinfo = {msg:"Authentication Not present",status_code:401};
            res.json(Userinfo);
        }

        // if(jwt.verify(token, 'nodeethos576asdas6')){
        //     console.log('verified');
        // }else{
        //     console.log('not verified');
        // }


        jwt.verify(token, 'nodeethos576asdas6', (err, user) => {
            if (err){
                res.json({"msg":"Invalid Token","statuscode":403});
            }else{
        next();
    }
        // pass the execution off to whatever request the client intended
    });

    }

}

module.exports = app;
