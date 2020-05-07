var express = require('express');
var router = express.Router();
const jwt = require("jsonwebtoken");
const keyinfo = require("../models/keyinfo");


/* GET users listing. */
router.post('/hospital/:id', function(req, res, next) {

    var hospital_id = req.params.id;


    keyinfo.hospitalinfo(hospital_id,function(keyinfoattributes){





        console.log("Return from ctlUser" + userDetails);
    });

});

function generateAccessToken(username) {
    // expires after half and hour (1800 seconds = 30 minutes)
    return jwt.sign(username, process.env.TOKEN_SECRET, { expiresIn: '1800s' });
}


module.exports = router;
