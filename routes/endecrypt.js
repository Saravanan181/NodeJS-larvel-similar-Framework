var express = require('express');
var router = express.Router();

var crypt = require("../endecrypt/crypt.js");

/* GET home page. */
router.post('/encrypt', function(req, res, next) {
    var data = JSON.stringify(req.body.data);
    crypt.encrypt(data,function(encryptData){
        res.send(encryptData);
    });
});


router.post('/decrypt', function(req, res, next) {
    var data = req.body.data;
    console.log(data);
    crypt.decrypt(data,function(decryptData){
        res.send(decryptData);
    });
});

module.exports = router;
