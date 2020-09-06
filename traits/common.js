var appconstant = require("../config/appconstant");
var http = require('http');
var fs = require('fs');
var path = require('path');

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

common.getFormattedDatetimemysql = (date) => {
        var todayTime = new Date(date);
        var month = todayTime.getMonth()+1;
        var day = todayTime.getDate();
        var year = todayTime.getFullYear();
        var seconds = todayTime.getSeconds();
        var minutes = todayTime.getMinutes();
        var hour = todayTime.getHours();

        return year+"-"+month+"-"+day+' '+hour+':'+minutes+':'+seconds;
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

common.fileupload = (fileoldpath,filenepath, callback) => {

        fs.rename(fileoldpath, filenepath, function (err) {
                if (err){

                }else{
                        callback();
                }

        });

}

common.censorEmail = (email) => {

    var arr = email.split("@");
    var str1 = arr[0];
    var str2 = arr[1];
    var str3 = str1[0] + "*".repeat(str1.length - 2) + str1.slice(-1);
    var str4 = str2[0] + "*".repeat(str2.length - 2) + str2.slice(-1);
    return str3 + "@" + str4;

}

common.randomstring = (length, chars) => {
    var mask = '';
    if (chars.indexOf('a') > -1) mask += 'abcdefghijklmnopqrstuvwxyz';
    if (chars.indexOf('A') > -1) mask += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    if (chars.indexOf('#') > -1) mask += '0123456789';
    if (chars.indexOf('!') > -1) mask += '~`!@#$%^&*()_+-={}[]:";\'<>?,./|\\';
    var result = '';
    for (var i = length; i > 0; --i) result += mask[Math.floor(Math.random() * mask.length)];
    return result;
}

module.exports = common;