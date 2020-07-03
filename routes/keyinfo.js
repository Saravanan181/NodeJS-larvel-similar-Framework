var express = require('express');
var router = express.Router();
const jwt = require("jsonwebtoken");
const keyinfo = require("../models/keyinfo");
var crypthex = require("../endecrypt/crypthex");
var smtp = require("../traits/sendmail");
var common = require("../traits/common");
var appconstant = require ('../config/appconstant');
var path = require('path');
var http = require('http');
var fs = require('fs');
var mime = require('mime');

/* GET users listing. */
router.get('/hospital/:id', function(req, res, next) {
    var hospital_id = req.params.id;
        keyinfo.hospitalinfo(crypthex.decrypt(hospital_id),function(keyinfoDetails,keycategoryDetails){
            var details = {statuscode:200,"keyinfoDetails":keyinfoDetails,"keycategoryDetails":keycategoryDetails};
            res.sendData = details;
            next();
        });
});

router.get('/sectionlist/:id/:pageno', function(req, res, next) {
    var category_id = req.params.id;
    var pageno = req.params.pageno;
    var items_page = 4;
    var limit = items_page*pageno;
    keyinfo.sectionlist(category_id,limit,items_page,req,res,function(sectionlist){
        var details = {statuscode:200,"list":sectionlist};
        res.sendData = details;
        next();
    });
});

router.post('/sendfeedback', function(req, res, next) {
    var data = req.body.data;
    data.hospital_id = crypthex.decrypt(data.hospital_id);
    keyinfo.hospitalfeedbackmail(data.hospital_id,req,res, function(feedbackmail){
        console.log(feedbackmail);
        data.feedbackmail = 'saravanan.j@innoppl.com';
        // var sendInfo = smtp.send(data);
        var details = {statuscode:200,"msg":'feedback send successfully'};
        res.sendData = details;
        next();
    });
});


router.get('/sectionimage/:imagekey', function(req, res, next) {
    var imagekey = req.params.imagekey;
    var decryptimagekey = JSON.parse(crypthex.decrypt(imagekey));
    
        var dest = appconstant.SECTIONFILEPATH+decryptimagekey;
        res.download(dest,decryptimagekey),function(err){
            console.log(err);
        };

});

module.exports = router;
