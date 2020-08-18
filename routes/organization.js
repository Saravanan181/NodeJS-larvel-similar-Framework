var express = require('express');
var router = express.Router();
const jwt = require("jsonwebtoken");
const organization = require("../models/organization.js");
var common = require("../traits/common");
var crypt = require("../endecrypt/crypt");
var appconstant = require("../config/appconstant");


router.get('/scan/:id', function(req, res, next) {


    var organizationid = req.params.id;

    organization.info(organizationid,req,res,function(organizationDetails){

        if(Array.isArray(organizationDetails) && organizationDetails.length){
            const token = jwt.sign({ name: organizationDetails[0].name,email:organizationDetails[0].email, id:organizationDetails[0].organization_id }, appconstant.JWTTOKENORGANIZATION ,{ expiresIn: 60*60*5, algorithm: "HS256" });
            var orginfo = {statuscode:200,msg:"QR-code Successfull",name: organizationDetails[0].name,email:organizationDetails[0].email,location:organizationDetails[0].location, token:token};
            res.sendData = orginfo;
            next();
        }else{
            var orginfo = {msg:"Organization Not Found",statuscode:401};
            res.sendData = orginfo;
            next();
        }

    });

});


/* GET users listing. */
// router.get('/generate', function(req, res, next) {
//     // QRCode.toFile('./tagetbay.png', '6tc0bd9f-11c0-42da-975e-2a8ad9ebae0b', {
//     //     color: {
//     //         dark: '#FF7F50',  // Blue dots
//     //         light: '#0000' // Transparent background
//     //     }
//     // }, function (err) {
//     //     if (err) throw err
//     //     console.log('done');
//     // })
// });



// router.get('/reader',function(req, res, next){
//
//
//     // var buffer = fs.readFileSync( './tagetbay.png');
//     console.log(__dirname + '/tagetbay.png');
//     var buffer = fs.readFileSync(__dirname + '/tagetbay.png');
//     var img = new ImageParser(img);
//     img.parse(function(err) {
//         if (err) {
//             console.error(err);
//             // TODO handle error
//         }
//         var qr = new QrCode();
//         qr.callback = function(err, value) {
//             if (err) {
//                 console.error(err);
//                 // TODO handle error
//                 return done(err);
//             }
//             console.log(value.result);
//             console.log(value);
//         };
//         qr.decode({width: img.width(), height: img.height()}, img._imgBuffer);
//     });
//
// });


module.exports = router;
