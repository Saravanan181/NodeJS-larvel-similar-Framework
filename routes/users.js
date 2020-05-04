var express = require('express');
var router = express.Router();
const jwt = require("jsonwebtoken");
const Users = require("../models/users.js");


/* GET users listing. */
router.post('/login', function(req, res, next) {

    var data = req.body.data;
    var Userinfo = {email:data.email, otp:data.otp};

    Users.info(Userinfo,function(userDetails){

        if(Array.isArray(userDetails) && userDetails.length){

            const token = jwt.sign({ username: userDetails[0].email_id,physican_id:userDetails[0].user_id,  role: 'doctor' }, 'nodeethos576asdas6',{ expiresIn: 60*60, algorithm: "HS256" });

            var Userinfo = {statuscode:200,msg:"Login Successfull",physican_id:userDetails[0].user_id,email:userDetails[0].email_id, user_name:userDetails[0].user_name,
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

router.get('/hospitals', function(req, res, next) {


    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    var userInfo = jwt.verify(token, 'nodeethos576asdas6');

    Users.hospital(userInfo.physican_id,function(hospitalList){

            var HospitalList = {statuscode:200,msg:"Hospital List",list:hospitalList};
            res.sendData = HospitalList;
            next();

    });

});


module.exports = router;
