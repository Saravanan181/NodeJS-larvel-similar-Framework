var express = require('express');
var router = express.Router();
const jwt = require("jsonwebtoken");
const Users = require("../models/users.js");
var common = require("../traits/common");
var crypt = require("../endecrypt/crypt");
var smtp = require("../traits/sendmail");
var appconstant = require("../config/appconstant");


/* GET users listing. */
router.post('/login', function(req, res, next) {


    var data = req.body.data;
    var Userinfo = {email:data.username, password:data.password, orgid:res.orgData.id};
    Users.info(Userinfo,req,res,function(userDetails){
        if(Array.isArray(userDetails) && userDetails.length){
            const token = jwt.sign({ email: userDetails[0].email,id:userDetails[0].pt_id,  name: userDetails[0].name }, appconstant.JWTTOKENUSER ,{ expiresIn: 60*60*5, algorithm: "HS256" });
            var Userinfo = {statuscode:200,msg:"Login Successfull",email: userDetails[0].email,id:userDetails[0].pt_id,
                name: userDetails[0].name, reset_password:userDetails[0].reset_password, token:token};
            res.sendData = Userinfo;
            next();
        }else{
            var Userinfo = {msg:"User Not Found",statuscode:401};
            res.sendData = Userinfo;
            next();
        }
    });
});


router.post('/passwordreset', function(req, res, next) {
    var data = req.body.data;

    var resetpasswordD = common.randomstring(8,'#aA');

    var resetpassword = {password:resetpasswordD, username:data.username, orgid:res.orgData.id };
    Users.resetpassword(resetpassword,req,res,function(userDetails){

        if(userDetails.changedRows==1){
            var password = resetpasswordD;

            var dataarray = {mail:data.username,subject: 'Amble reset password' , password: password};

            var sendInfo = smtp.sendresetpassword(dataarray);
            console.log('mail');
            var Userinfo = {msg:"Temporary password send to mail - "+common.censorEmail(data.username),statuscode:200};
        }else{
            var Userinfo = {msg:"Please try to reset again with proper User/Organization",statuscode:403};
        }



        res.sendData = Userinfo;
        next();


    });
});


router.post('/changepassword', function(req, res, next) {
    var data = req.body.data;

    var resetpasswordD = data.password;

    var resetpassword = {password:resetpasswordD, id:res.userData.id, orgid:res.orgData.id};
    Users.chpss(resetpassword,req,res,function(userDetails){

        var Userinfo = {msg:"Password changed successfully",statuscode:200};
        res.sendData = Userinfo;
        next();


    });
});



router.get('/sessionsettings/:uuid', function(req, res, next) {
    var uuid = req.params.uuid;
    Users.sessionsetings(uuid,req,res,function(sessionData){
        var defaultSession = {}; var patientSession = {};
        if (Array.isArray(sessionData) && sessionData.length) {
            for (var pLoop = 0; pLoop < sessionData.length; pLoop++) {

                if(sessionData[pLoop].type==1){
                    defaultSession = {
                        "swing_time" : sessionData[0].swing_time,
                        "hold_time" : sessionData[0].hold_time,
                        "rise_speed" : sessionData[0].rise_speed,
                        "max_dorsiflexion_angle" : sessionData[0].max_dorsiflexion_angle
                    }
                }

                if(sessionData[pLoop].type==2){
                    patientSession = {
                        "swing_time" : sessionData[0].swing_time,
                        "hold_time" : sessionData[0].hold_time,
                        "rise_speed" : sessionData[0].rise_speed,
                        "max_dorsiflexion_angle" : sessionData[0].max_dorsiflexion_angle
                    }
                }
            }
        }
        var patientInfo = {msg:"Patient session settings",statuscode:200,defaultsession: defaultSession,patientsession:patientSession};
        res.sendData = patientInfo;
        next();
    });
});




router.get('/logout', function(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    // var userInfo = jwt.verify(token, 'nodeethos576asdas6');
});





module.exports = router;
