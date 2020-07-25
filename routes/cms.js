var express = require('express');
var router = express.Router();
const cms = require("../models/cms.js");



router.get('/terms', function(req, res, next) {

    cms.getpage(1,req,res,function(description){

        var info = {msg:"Terms and condition",statuscode:200,description:description[0].description};
        res.end(JSON.stringify(info));


    });
});

router.get('/privacy', function(req, res, next) {

    cms.getpage(2,req,res,function(description){

        var info = {msg:"Terms and condition",statuscode:200,description:description[0].description};
        res.end(JSON.stringify(info));


    });
});



module.exports = router;
