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

    console.log(data);

    patient.add(data,req,res,function(userDetails){

            var Userinfo = {msg:"Patient added successfully",statuscode:200,"patient_id":data.patientid};
            res.sendData = Userinfo;
            next();

    });
});


router.get('/search/:id', function(req, res, next) {
    var patient_id = req.params.id;

    patient.search(patient_id,req,res,function(patientDetail){

        var Info = {msg:"Patient details",statuscode:200,"details":patientDetail[0]};
        res.sendData = Info;
        next();

    });
});

module.exports = router;
