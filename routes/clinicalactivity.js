var express = require('express');
var router = express.Router();
const jwt = require("jsonwebtoken");
const clinicalactivity = require("../models/clinicalactivity");
var crypthex = require("../endecrypt/crypthex");


/* GET users listing. */
router.get('/encountertype/:id', function(req, res, next) {
    var hospital_id = req.params.id;
    clinicalactivity.encounterinfo(crypthex.decrypt(hospital_id),req,res, function(encountertypes){
        var details = {statuscode:200,"list":encountertypes,"msg":"Encounter list"};
        res.sendData = details;
        next();
    });
});


router.get('/diagnosis', function(req, res, next) {
    var hospital_id = req.params.id;
    clinicalactivity.diagnosis(req,res, function(list){
        var details = {statuscode:200,"list":list,"msg":"Encounter list"};
        res.sendData = details;
        next();
    });
});



router.get('/cptcodes', function(req, res, next) {
    var hospital_id = req.params.id;
    clinicalactivity.codes(req,res, function(codes){
        var details = {statuscode:200,"list":encountertypes,"msg":"Codes list"};
        res.sendData = details;
        next();
    });
});


router.post('/addlog', function(req, res, next) {
    var data = req.body.data;
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    var userInfo = jwt.verify(token, 'nodeethos576asdas6');

        var diagonis_data = [];
        diagonis_data.status = 2;
        diagonis_data.data = data.diagonis_type;
        diagonis_data.data_other = data.other_diagonis;
        clinicalactivity.insertdiagonis(diagonis_data,req,res, function(insertId){
            var addlogdetails = [];
            addlogdetails.provider_id = userInfo.physican_id;
            addlogdetails.hospital_id = data.hospital_id;
            addlogdetails.patient_first_name = data.patient_first_name;
            addlogdetails.patient_last_name = data.patient_last_name;
            addlogdetails.patient_mrn = data.patient_mrn;
            addlogdetails.dob = data.dob;
            addlogdetails.encounter_type = data.encounter_type;
            addlogdetails.cpi_code = data.cpi_code;
            addlogdetails.consults_hours = data.consults_hours;
            addlogdetails.diagonis_type = insertId;
            addlogdetails.service_date = data.service_date;
            addlogdetails.shift_date = data.shift_date;
            addlogdetails.activity_log = data.activity_log;
            addlogdetails.status = 1;

            clinicalactivity.insertClinicallog(addlogdetails,req,res, function(insertId){
                if(data.activity_log!=0){
                    var details = {statuscode:200,"msg":"Clinical activity log updated succesfully"};
                }else{
                    var details = {statuscode:200,"msg":"Clinical activity log created succesfully"};
                }

                res.sendData = details;
                next();
            });

        });

});

router.get('/draftlist/:pageno', function(req, res, next) {
    var pageno = req.params.pageno;
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    var userInfo = jwt.verify(token, 'nodeethos576asdas6');

    var items_page = 4;
    var limit = items_page*pageno;
    var datas = [];
    clinicalactivity.clinicalloglist(userInfo.physican_id,limit,items_page,1,req,res,datas, function(list){
        var details = {statuscode:200,"list":list,"msg":"Encounter list"};
        res.sendData = details;
        next();
    });
});


router.post('/report', function(req, res, next) {
    var datas = req.body.data;
console.log(datas);
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    var userInfo = jwt.verify(token, 'nodeethos576asdas6');

    var items_page = 4;
    var limit = items_page*datas.pageno;

    clinicalactivity.clinicalloglist(userInfo.physican_id,limit,items_page,1,req,res,datas, function(list){
        var details = {statuscode:200,"list":list,"msg":"Encounter list"};
        res.sendData = details;
        next();
    });
});

module.exports = router;
