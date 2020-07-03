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

common.taskfilelocation = (taskid,comments,category_id,user_type,file_name) => {

        if(category_id==1){
                var catgeory_folder_name = 'eagle-cetification/';
        }else if(category_id==2){
                var catgeory_folder_name = 'licensing/';
        }else if(category_id==4){
                var catgeory_folder_name = 'onboarding/';
        }else if(category_id==3){
                var catgeory_folder_name = 'external-credentialing/';
        }

        var user_type_folder = 'provider-task-documents/';
        if(user_type==1){//admin
                user_type_folder = '';
        }

        var subfolder = 'task-documents/';
        if(comments==1){
                var subfolder = 'conversation-documents/';
                 user_type_folder = 'provider-conversation-documents/';
                if(user_type==1){//admin
                        user_type_folder = '';
                }
        }
                return catgeory_folder_name+taskid+'/'+subfolder+user_type_folder+file_name;
}

module.exports = common;