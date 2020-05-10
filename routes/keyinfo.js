var express = require('express');
var router = express.Router();
const jwt = require("jsonwebtoken");
const keyinfo = require("../models/keyinfo");


/* GET users listing. */
router.get('/hospital/:id', function(req, res, next) {

    var hospital_id = req.params.id;


    keyinfo.hospitalinfo(hospital_id,function(keyinfoDetails,keycategoryDetails){

        var details = {statuscode:200,"keyinfoDetails":keyinfoDetails,"keycategoryDetails":keycategoryDetails};
        res.sendData = details;
        next();

    });

});

function generateAccessToken(username) {
    // expires after half and hour (1800 seconds = 30 minutes)
    return jwt.sign(username, process.env.TOKEN_SECRET, { expiresIn: '1800s' });
}


module.exports = router;
