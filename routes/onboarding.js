var express = require('express');
var router = express.Router();
const jwt = require("jsonwebtoken");
var common = require("../traits/common");
const onboarding = require("../models/onboarding");
var crypthex = require("../endecrypt/crypthex");


/* GET users listing. */
router.get('/list/:type/:pageno', function(req, res, next) {
    var type = req.params.type;
    var pageno = req.params.pageno;
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    var userInfo = jwt.verify(token, 'nodeethos576asdas6');

    var items_page = 4;
    var limit = items_page*pageno;

    onboarding.list(userInfo.physican_id,type,limit,items_page,req,res, function(list){
        var details = {statuscode:200,"list":list,"msg":"Task list"};
        res.sendData = details;
        next();
    });
});


router.get('/taskdetails/:id', function(req, res, next) {
    var id = req.params.id;

    onboarding.details(id,req,res, function(details){
        var details = {statuscode:200,"details":details,"msg":"Task Details"};
        res.sendData = details;
        next();
    });
});

router.post('/updateavaildate', function(req, res, next) {

    var data = req.body.data;

    onboarding.availtaskdpu(data,req,res, function(details){
        var details = {statuscode:200,"msg":"Available time updated"};
        res.sendData = details;
        next();
    });
});


router.post('/updatereminddate', function(req, res, next) {
    var data = req.body.data;
    onboarding.remindtaskdpu(data,req,res, function(details){
        var details = {statuscode:200,"msg":"Reminder time updated"};
        res.sendData = details;
        next();
    });
});


router.put('/removereminddate/:id', function(req, res, next) {
    var id = req.params.id;
    onboarding.remindtasketeled(id,req,res, function(details){
        var details = {statuscode:200,"msg":"Reminder deleted Successfully"};
        res.sendData = details;
        next();
    });
});

router.get('/taskcommentslist/:id', function(req, res, next) {
    var id = req.params.id;
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    var userInfo = jwt.verify(token, 'nodeethos576asdas6');
    onboarding.commnetsdetailslist(userInfo.physican_id,id,req,res, function(details){
        var details = {statuscode:200,"msg":"Commnets list","list":details};
        res.sendData = details;
        next();
    });
});


router.post('/taskcommentinsert', function(req, res, next) {
    var data = req.body.data;

    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    var userInfo = jwt.verify(token, 'nodeethos576asdas6');
    onboarding.inscomtk(userInfo.physican_id,data,req,res, function(details){
        var details = {statuscode:200,"msg":"Comments inserted"};
        res.sendData = details;
        next();
    });
});

router.get('/typemenu', function(req, res, next) {
    var data = req.body.data;

    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    var userInfo = jwt.verify(token, 'nodeethos576asdas6');
    onboarding.gettypestatus(userInfo.physican_id,req,res, function(details){
        var details = {statuscode:200,"msg":"Comments inserted","list":details};
        res.sendData = details;
        next();
    });
});


module.exports = router;
