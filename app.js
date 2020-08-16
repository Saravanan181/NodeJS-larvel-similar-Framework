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
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var enDecryptRouter = require('./routes/endecrypt');
var logRouter = require('./routes/logaccess');
var cmsRouter = require('./routes/cms');
var patientRouter = require('./routes/patient');
var organizationRouter = require('./routes/organization')


//models
var userModel = require('./models/users');
var orgModel = require('./models/organization');

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

app.use(bodyParser.urlencoded());


// users details
app.use('/users', orgAuthToken, usrAuthToken, middleware.afterrequest, usersRouter, middleware.beforeresponse);
app.use('/patient',orgAuthToken, usrAuthToken, middleware.afterrequest, patientRouter, middleware.beforeresponse);
// app.use('/keyinfo',authenticateToken,middleware.afterrequest, keyinfoRouter, middleware.beforeresponse);
// app.use('/clinicalactivity',authenticateToken,middleware.afterrequest, clinicalactivityRouter, middleware.beforeresponse);
// app.use('/onboarding',authenticateToken,middleware.afterrequest, onboardingRouter, middleware.beforeresponse);
//keyinfo details




app.use('/crypt',enDecryptRouter);
app.use('/organization',middleware.afterrequest, organizationRouter, middleware.beforeresponse);
app.use('/log',logRouter);
app.use('/cms',cmsRouter);


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


function orgAuthToken(req, res, next) {

        // console.log(req.headers);
        if(!req.headers['proxy-authorization']){
            res.sendData  = {"msg":"Organization Token Missing","statuscode":403};
            middleware.beforeresponse(req,res);
        }
        //
        const authHeader = req.headers['proxy-authorization'];
        //
        const token = authHeader && authHeader.split(' ')[1];
        if (token == null){
            res.sendData  = {msg:"Proxy-Authorization Not present",status_code:401};
            middleware.beforeresponse(req,res);
        }

        jwt.verify(token, appconstant.JWTTOKENORGANIZATION , (err, orgData) => {
            if (err){
                res.sendData  = {"msg":"Invalid Token","statuscode":403};
                middleware.beforeresponse(req,res);
            }else{

                res.orgData = orgData;
                console.log(orgData);
                orgModel.info(orgData.id,req,res,function(userDetails){
                    if(userDetails[0].organization_id===orgData.id){
                        next();
                    }else{
                        res.sendData  = {"msg":"Invalid Organization","statuscode":401};
                        middleware.beforeresponse(req,res);
                    }
                });

            }
        // pass the execution off to whatever request the client intended
    });

}


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
                console.log(res.userData);
                userModel.validateUser(user,req,res,function(userDetails){
                    console.log(userDetails[0]);
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
