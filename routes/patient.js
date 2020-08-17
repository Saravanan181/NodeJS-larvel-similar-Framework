var express = require('express');
var router = express.Router();
const jwt = require("jsonwebtoken");
const patient = require("../models/patient");
var common = require("../traits/common");
var crypt = require("../endecrypt/crypt");

/* GET users listing. */
router.post('/add', function(req, res, next) {
    var data = req.body.data;

    data.patientid = "Amble"+( String(new Date().getHours())+String(new Date().getMinutes())+String(new Date().getSeconds())+String(new Date().getDate())+String(new Date().getMonth())+String(new Date().getYear()));

    data.orgid = res.orgData.id;

    console.log(data);

    patient.add(data,req,res,function(userDetails){

            var Userinfo = {msg:"Patient added successfully",statuscode:200,"patient_id":data.patientid};
            res.sendData = Userinfo;
            next();

    });
});


router.get('/search/:id', function(req, res, next) {
    var patient_id = req.params.id;

    var orgid = res.orgData.id;

    patient.search(orgid,patient_id,req,res,function(patientDetail){

        var Info = {msg:"Patient Details List",statuscode:200,"details":patientDetail};
        res.sendData = Info;
        next();

    });
});

module.exports = router;
