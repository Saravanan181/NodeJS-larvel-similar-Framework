var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var morgan = require('morgan');
const jwt = require("jsonwebtoken");
var logconf = require('./config/logconf');
var bodyParser = require('body-parser');
var appconstant = require('./config/appconstant');

//middleware
var middleware = require('./middleware/reqresmiddleware');
var http = require('http');

//routes - controller
var usersRouter = require('./routes/users');
var enDecryptRouter = require('./routes/endecrypt');
var logRouter = require('./routes/logaccess');


//models
var userModel = require('./models/users');


var app = express();
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');
app.set('view engine', 'ejs');
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

app.use(bodyParser.urlencoded());


// routes
app.use('/users', usrAuthToken, middleware.afterrequest, usersRouter, middleware.beforeresponse);
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

function usrAuthToken(req, res, next) {


    var reqpath = req.path.split('/')[1];console.log(reqpath);
    if(reqpath == 'passwordreset' || reqpath == 'login'){
        next()
    }else{

        // console.log(req.headers);
        if(!req.headers['authorization']){
            res.sendData  = {"msg":"User Token Missing","statuscode":403};
            middleware.beforeresponse(req,res);
        }
        //
        const authHeader = req.headers['authorization'];
        //
        const token = authHeader && authHeader.split(' ')[1];
        if (token == null){
            res.sendData  = {msg:"Authorization Not present",status_code:401};
            middleware.beforeresponse(req,res);
        }

        jwt.verify(token, appconstant.JWTTOKENUSER , (err, user) => {
            if (err){
                res.sendData  = {"msg":"Invalid Token","statuscode":403};
                middleware.beforeresponse(req,res);
            }else{

                res.userData = user;

                userModel.validateUser(user,req,res,function(userDetails){
                    console.log('kil');
                    console.log(userDetails);
                if(userDetails[0].email===user.email){
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
