var express = require('express');
var router = express.Router();
var lineReader = require('reverse-line-reader');


//requiring path and fs modules
const path = require('path');
const fs = require('fs');
//joining path of directory
const directoryPath = path.join(__dirname, '../logs');


router.get('/viewer', function(req, res, next) {

    fs.readdir(directoryPath, function (err, files) {
        //handling error
        if (err) {
            return console.log('Unable to scan directory: ' + err);
        }
        res.render('index', { files: files });
    });

});


router.get('/:id', function(req, res, next) {

    var filename = req.params.id;
    // var s = backwardsStream(path.join(__dirname, '../logs/'+filename));

    // read all lines:
    lineReader.eachLine(path.join(__dirname, '../logs/'+filename), function(line) {
        res.write(line);
    }).then(function () {
        console.log("I'm done!!");
    });


});

module.exports = router;
