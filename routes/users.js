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
    var Userinfo = {email:data.username, password:data.password};
    Users.info(Userinfo,req,res,function(userDetails){
        if(Array.isArray(userDetails) && userDetails.length){
            const token = jwt.sign({ email: userDetails[0].email,id:userDetails[0].pt_id,  name: userDetails[0].name }, appconstant.JWTTOKENUSER ,{ expiresIn: 60*60*5, algorithm: "HS256" });
            var Userinfo = {statuscode:200,msg:"Login Successfull",email: userDetails[0].email,id:userDetails[0].user_id,
                name: userDetails[0].name, token:token};
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
            var dataarray = {mail:data.username,subject: 'Reset password' , password: password};
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




module.exports = router;
