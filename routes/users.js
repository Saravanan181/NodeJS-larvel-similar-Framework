var express = require('express');
var router = express.Router();
const jwt = require("jsonwebtoken");
const Users = require("../models/users.js");
var common = require("../traits/common");
var crypt = require("../endecrypt/crypt");
var smtp = require("../traits/sendmail");

/* GET users listing. */
router.post('/login', function(req, res, next) {
    var data = req.body.data;
    var Userinfo = {email:data.email, password:crypt.encryptreturn(data.password)};
    Users.info(Userinfo,req,res,function(userDetails){
        if(Array.isArray(userDetails) && userDetails.length){
            const token = jwt.sign({ username: userDetails[0].username,id:userDetails[0].id,  name: userDetails[0].name }, 'nodeethos576asdas6',{ expiresIn: 60*60*5, algorithm: "HS256" });
            var Userinfo = {statuscode:200,msg:"Login Successfull",email:userDetails[0].email_id, user_name:userDetails[0].user_name,
                first_name:userDetails[0].first_name,last_name:userDetails[0].last_name, token:token};
            res.sendData = Userinfo;
            next();
        }else{
            var Userinfo = {msg:"User Not Found",statuscode:401};
            res.sendData = Userinfo;
            next();
        }
    });
});


router.get('/passwordreset', function(req, res, next) {
    var data = req.body.data;

    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    var userInfo = jwt.verify(token, 'nodeethos576asdas6');

    var resetpasswordD = common.randomstring(8,'#aA');

    var resetpassword = {password:crypt.encryptreturn(resetpasswordD), id:userInfo.id};
    Users.resetpassword(resetpassword,req,res,function(userDetails){

        var htmltext = 'Use the tempory password to login - '+resetpasswordD;

        var dataarray = {mail:userInfo.username,subject: 'Amble reset password' , html: htmltext};

        var sendInfo = smtp.send(dataarray);

        var Userinfo = {msg:"Temporary password send to mail,",statuscode:200};
        res.sendData = Userinfo;
        next();


    });
});

module.exports = router;
