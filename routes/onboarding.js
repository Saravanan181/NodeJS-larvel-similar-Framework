var express = require('express');
var router = express.Router();
const jwt = require("jsonwebtoken");
var common = require("../traits/common");
const onboarding = require("../models/onboarding");
var crypthex = require("../endecrypt/crypthex");
var async = require('async');
var path = require('path');
var formidable = require('formidable');
const multer = require('multer');
var fs = require('fs');
var appconstant = require('../config/appconstant');

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

router.get('/fileslist/:type/:id/:pageno', function(req, res, next) {
    var id = req.params.id;
    var type = req.params.type;
    var pageno = req.params.pageno;

    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    var userInfo = jwt.verify(token, 'nodeethos576asdas6');

    var items_page = 4;
    var limit = items_page*pageno;

    onboarding.getfileslistupd(userInfo.physican_id,type,id,limit,items_page, req,res, function(details){
        var details = {statuscode:200,"msg":"Comments inserted","list":details};
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



router.get('/taskimage/:filekey', function(req, res, next) {

    var filekey = req.params.filekey;
    var decryptfilekey = JSON.parse(crypthex.decrypt(filekey));
        var dest = appconstant.TASKFILECONSTANT+decryptfilekey;
        res.download(dest,decryptimagekey),function(err){
            console.log(err);
        };

});


var storage	=	multer.diskStorage({

    destination: function (req, file, callback) {

        var dirPath = appconstant.TASKFILECONSTANT+req.categoryfoldername+'/conversation-documents/provider-conversation-documents/';
        if (!fs.existsSync(dirPath)){
            fs.mkdirSync(dirPath,'0777');
        }
        req.directory = dirPath;

        callback(null, dirPath);
    },
    filename: function (req, file, callback) {

        if(typeof req.body.filenamearray == 'undefined' || req.body.filenamearray==''){
            var filenamearray = [];
        }else{
            var filenamearray = req.body.filenamearray;
        }

        var ext = file.originalname.split('.');
        var fileextension = '.'+(ext[1]);
        if(!fs.existsSync(req.directory+file.originalname)){

            // req.body.filenamearray.push(file.originalname);
            filenamearray.push(file.originalname);

            callback(null, file.originalname);
         }else{
             for(var j=1;j<=20;j++) {
                 if(!fs.existsSync(req.directory+ext[0]+'_'+j+fileextension)){
                     var filenameupdate = ext[0]+'_'+j+fileextension;
                     filenamearray.push(filenameupdate);
                     // req.body.filenamearray.push(filenameupdate);
                     break;
                 }
             }
            req.body.filenamearray = filenamearray;

            callback(null, filenameupdate);
        }

    }
});
var upload = multer({ storage : storage }).array('taskfile',2);


router.post('/taskimageupload', function(req, res, next) {

    var taskid = req.body.taskid;

    onboarding.gettypestatus(taskid,req,res, function(details){
            var categoryfoldername = 'eagle-certification';
        if(details==2){
            categoryfoldername = 'licensing';
        }else if(details==3){
            categoryfoldername = 'externalcredentialing';
        }else if(details==4){
            categoryfoldername = 'onboarding';
        }

        var dirPathCategory = appconstant.TASKFILECONSTANT+categoryfoldername;
        if (!fs.existsSync(dirPathCategory)){
            fs.mkdirSync(dirPathCategory,'0777');
        }

        if (!fs.existsSync(dirPathCategory+taskid+'/')){
            fs.mkdirSync(dirPathCategory+taskid+'/','0777');
        }

        req.categoryfoldername = categoryfoldername;

        upload(req,res, function(err) {
            console.log(req.body);
            console.log(req.files.length);
            if(err) {
                var msg = 'Files uploaded fail,Please try again';
                var details = {statuscode:400,"msg":msg};
                res.sendData = details;
                next();
            }else{
                const authHeader = req.headers['authorization'];
                const token = authHeader && authHeader.split(' ')[1];
                var userInfo = jwt.verify(token, 'nodeethos576asdas6');
                var fileslist = JSON.stringify(req.body.filenamearray);

                var insertquerybuild = " ('"+req.body.taskid+"','"+userInfo.physican_id+"','2','"+fileslist+"')";

                onboarding.updateimageuploadcomments(insertquerybuild,req,res, function(details){
                    var msg = 'Files uploaded successfully';
                    var details = {statuscode:200,"msg":msg};
                    res.sendData = details;
                    next();
                });


            }

        });


    });




});




var storageadmin	=	multer.diskStorage({

    destination: function (req, file, callback) {

        var dirPath = appconstant.TASKFILECONSTANT+req.categoryfoldername+'/task-documents/provider-conversation-documents/';
        if (!fs.existsSync(dirPath)){
            fs.mkdirSync(dirPath,'0777');
        }
        req.directory = dirPath;

        callback(null, dirPath);
    },
    filename: function (req, file, callback) {


        var ext = file.originalname.split('.');
        var fileextension = '.'+(ext[1]);
        if(!fs.existsSync(req.directory+file.originalname)){

            // req.body.filenamearray.push(file.originalname);
            req.body.filenamearray = file.originalname;

            callback(null, file.originalname);
        }else{
            for(var j=1;j<=20;j++) {
                if(!fs.existsSync(req.directory+ext[0]+'_'+j+fileextension)){
                    var filenameupdate = ext[0]+'_'+j+fileextension;

                    req.body.filenamearray = filenameupdate;

                    break;
                }
            }

            callback(null, filenameupdate);
        }

    }
});
var uploadadmin = multer({ storage : storageadmin }).single('taskadminfile');


router.post('/taskadminimageupload', function(req, res, next) {

    var taskid = req.body.taskid;

    onboarding.gettypestatus(taskid,req,res, function(details){
        var categoryfoldername = 'eagle-certification';
        if(details==2){
            categoryfoldername = 'licensing';
        }else if(details==3){
            categoryfoldername = 'externalcredentialing';
        }else if(details==4){
            categoryfoldername = 'onboarding';
        }

        var dirPathCategory = appconstant.TASKFILECONSTANT+categoryfoldername;
        if (!fs.existsSync(dirPathCategory)){
            fs.mkdirSync(dirPathCategory,'0777');
        }

        if (!fs.existsSync(dirPathCategory+taskid+'/')){
            fs.mkdirSync(dirPathCategory+taskid+'/','0777');
        }
        
        req.categoryfoldername = categoryfoldername;

        uploadadmin(req,res, function(err) {

            if(err) {
                var msg = 'Files uploaded fail,Please try again';
                var details = {statuscode:400,"msg":msg};
                res.sendData = details;
                next();
            }else{
                const authHeader = req.headers['authorization'];
                const token = authHeader && authHeader.split(' ')[1];
                var userInfo = jwt.verify(token, 'nodeethos576asdas6');
                var filesname = req.body.filenamearray;
                var uploadid = req.body.uploadid;
                onboarding.updateimageadminupload(filesname,uploadid,req,res, function(details){
                    var msg = 'Files uploaded successfully';
                    var details = {statuscode:200,"msg":msg};
                    res.sendData = details;
                    next();
                });


            }

        });


    });




});


module.exports = router;
