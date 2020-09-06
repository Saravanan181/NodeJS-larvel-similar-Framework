var crypt = require("../endecrypt/crypt");
var logconf = require('../config/logconf');
// constructor
const reqresmiddleware = function() {

};

reqresmiddleware.afterrequest =  (req, res, next) => {
    if(req.body.data){
        var data = req.body.data;

        crypt.decrypt(data,function(decrypted){
            var logdata = {"type":'access',"data":decrypted,"customsg":req.path + ' "path requested - requested Data" '};
            logconf.writelog(logdata);
            req.body.data = JSON.parse(decrypted);

            next()
        });
    }else{
        next()
    }
}

reqresmiddleware.beforeresponse = (req,res) => {
    var data = res.sendData;res.sendData = '';
    var statuscode = data.statuscode;
    crypt.encrypt(JSON.stringify(data),function(encryptData){
        var logdata = {"type":'access',"data":JSON.stringify(data),"customsg":req.path + ' "path requested - response Data" '};
        logconf.writelog(logdata);
        res.status(statuscode).json({"data":encryptData});
    });
}

module.exports = reqresmiddleware;