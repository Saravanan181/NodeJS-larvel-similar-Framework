var appconstant = require("../config/appconstant");
var http = require('http');
var fs = require('fs');

// constructor
const common = function() {

};

common.getFormattedDateop = (date) => {
        var todayTime = new Date(date);
        var month = todayTime.getMonth()+1;
        var day = todayTime.getDate();
        var year = todayTime.getFullYear();
        return month + "-" + day + "-" + year;
}

common.getFormattedDatemysql = (date) => {
        var todayTime = new Date(date);
        var month = todayTime.getMonth()+1;
        var day = todayTime.getDate();
        var year = todayTime.getFullYear();
        return year+"-"+month+"-"+day;
}

common.filedownload = (req,res,decryptimagekey, callback) => {
        var filePathDefault = appconstant.SECTIONFILEPATH+decryptimagekey;
        var dest = process.cwd()+'/templefile/'+decryptimagekey;
        var file = fs.createWriteStream(dest);
        http.get(filePathDefault, function(res) {
            res.pipe(file);
            file.on('finish', function(res) {
                    callback(decryptimagekey);
            });
        });
}

module.exports = common;