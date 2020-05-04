var express = require('express');
var router = express.Router();
const jwt = require("jsonwebtoken");
const Users = require("../models/users.js");


/* GET users listing. */
router.post('/', function(req, res, next) {

    var data = req.body.data;

    var Userinfo = {email:data.email, otp:data.otp};

    Users.info(Userinfo,function(userDetails){

        if(Array.isArray(userDetails) && userDetails.length){

            const token = jwt.sign({ username: userDetails[0].email_id,  role: 'doctor' }, 'nodeethos576asdas6',{ expiresIn: 60*60, algorithm: "HS256" });

            var Userinfo = {statuscode:200,msg:"Login Successfull",email:userDetails[0].email_id, user_name:userDetails[0].user_name,
                first_name:userDetails[0].first_name,last_name:userDetails[0].last_name, token:token};

            res.sendData = Userinfo;

            next();
        }else{
            console.log('not found');
            var Userinfo = {msg:"User Not Found",statuscode:401};
            res.sendData = Userinfo;

            next();
        }


        console.log("Return from ctlUser" + userDetails);
    });

});

function generateAccessToken(username) {
    // expires after half and hour (1800 seconds = 30 minutes)
    return jwt.sign(username, process.env.TOKEN_SECRET, { expiresIn: '1800s' });
}


module.exports = router;
