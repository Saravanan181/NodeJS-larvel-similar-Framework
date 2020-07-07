const sql = require("./mysqlconnect.js");
var middleware = require('../middleware/reqresmiddleware');
var crypthex = require("../endecrypt/crypthex");
var appconstant = require("../config/appconstant");
var common = require("../traits/common");
var formidable = require('formidable');
var async = require('async');

// constructor
const onboarding = function() {

};

 onboarding.list = (physican_id,type,limit,items_page,req,res, callback) => {
    sql.getConnection(function(err, connection) {
        if (err) {
            res.sendData = {"msg":'Server under maintaince',"statuscode":503};
            middleware.beforeresponse(req,res);
        }else{

            var query = "SELECT created_at as created_date, copied_task_id as task_id,task_name,due_date,is_provider_completed FROM `onboarding_task_detail_user_assigned`  " +

                        " where `assigned_provider_id`='"+physican_id+"' and is_internal_resource_completed='1' and task_category_id='"+type+"' limit ?,? ";
            console.log(query);
            connection.query(query,
                [limit,items_page], (err, rows) => {
                    if(err) {
                        console.log(err);
                        res.sendData = {"msg":'Server under maintaince',"statuscode":506};
                        middleware.beforeresponse(req,res);
                    }else{
                        connection.release();
                        var list = [];
                        //
                        if(Array.isArray(rows) && rows.length){
                            for(var pLoop=0;pLoop<rows.length;pLoop++)
                            {
                                var status = 'Incomplete';
                                if(rows[pLoop].is_provider_completed==0){
                                     status = 'Incomplete';
                                }else if(rows[pLoop].is_provider_completed==2){
                                     status = 'Completed';
                                }

                                list[pLoop] = {
                                    "task_name":rows[pLoop].task_name,
                                    "due_date":common.getFormattedDateop(rows[pLoop].due_date) + appconstant.CONSTTIMEZONE,
                                    "task_id":rows[pLoop].task_id,
                                    "created_date":common.getFormattedDateop(rows[pLoop].created_date) + appconstant.CONSTTIMEZONE,
                                    // "created_date":rows[pLoop].created_date + appconstant.CONSTTIMEZONE,
                                    "status":status
                                };
                            }
                        }
                        callback(list);
                    }
                });
        }
    });
}

onboarding.details = (id,req,res, callback) => {
    sql.getConnection(function(err, connection) {
        if (err) {
            res.sendData = {"msg":'Server under maintaince',"statuscode":503};
            middleware.beforeresponse(req,res);
        }else{

            var query = "SELECT a.task_category_id,a.task_category_type_id,a.assigned_provider_id,a.copied_task_id as reminder_id,a.task_description,a.created_at as created_date, " +
                "a.copied_task_id as task_id,a.task_name,a.due_date,a.is_provider_completed, "+
            " group_concat(DATE_FORMAT(DATE(available_dates), \"%m %d %Y\"),' ',from_time,' ',to_time,'$$',provider_available_dates,'$$',available_dates_id) as available_date, "+
            // " group_concat(remind_on,'$$',remind_id) as remind_date "+
            " (select group_concat(DATE_FORMAT(y.remind_on, \"%m %d %Y %H:%i:%s\"),'$$',y.remind_id) from onboarding_task_provider_remind_on as y where y.copied_task_id=? and y.remind_on_status='1' group by y.copied_task_id ) as remind_date  "+
            " FROM `onboarding_task_detail_user_assigned` as a " +
            " left join onboarding_task_users_available_dates as c on c.copied_task_id=a.copied_task_id " +

            " where a.copied_task_id=? group by c.copied_task_id ";
            console.log(query);
            connection.query(query,
                [id,id], (err, rows) => {
                    if(err) {
                        console.log(err);
                        res.sendData = {"msg":'Server under maintaince',"statuscode":506};
                        middleware.beforeresponse(req,res);
                    }else{
                        connection.release();
                        var details = [];

                        if(Array.isArray(rows) && rows.length){

                            var date_avail = [];

                            if(rows[0].available_date!=null && rows[0].assigned_provider_id!=2){

                                var date_av = rows[0].available_date.split(',');
                                if(Array.isArray(date_av) && date_av.length){
                                    for(var pIloop=0;pIloop<date_av.length;pIloop++)
                                    {
                                        var provided_check = date_av[pIloop].split('$$');
                                        console.log(provided_check);
                                        date_avail[pIloop] = {
                                            "is_selected" : parseInt(provided_check[1]),
                                            "date" : provided_check[0] + appconstant.CONSTTIMEZONE,
                                            "available_date_id" : provided_check[2],
                                        };
                                    }
                                }

                            }

                            var date_remind = [];

                            if(rows[0].remind_date!=null){

                                var date_re = rows[0].remind_date.split(',');

                                if(Array.isArray(date_re) && date_re.length){
                                    for(var pIloop=0;pIloop<date_re.length;pIloop++)
                                    {
                                        var provided_remind = date_re[pIloop].split('$$');
                                        date_remind[pIloop] = {
                                            "date" : provided_remind[0] + appconstant.CONSTTIMEZONE,
                                            "remind_date_id" : provided_remind[1],
                                        };
                                    }
                                }

                            }

                            var edit_submit = 0;

                            if(rows[0].assigned_provider_id==2){
                                var edit_submit = 1;
                            }


                            details = {
                                "task_name" : rows[0].task_name,
                                "task_id" : rows[0].task_id,
                                "reminder_id" : rows[0].reminder_id,
                                "due_date" : common.getFormattedDateop(rows[0].due_date) + appconstant.CONSTTIMEZONE,
                                "created_date" : common.getFormattedDateop(rows[0].created_date) + appconstant.CONSTTIMEZONE,
                                // "created_date" : rows[0].created_date,
                                "task_description" : rows[0].task_description,
                                "available_date" : date_avail,
                                "remind_date" : date_remind,
                                "edit_submit" : edit_submit
                            }
                        }
                        callback(details);
                    }
                });
        }
    });
}

onboarding.availtaskdpu = (data,req,res, callback) => {

     var ids = data.ids;
     var status = data.status;

    sql.getConnection(function(err, connection) {
        if (err) {
            res.sendData = {"msg":'Server under maintaince',"statuscode":503};
            middleware.beforeresponse(req,res);
        }else{

            var query = "UPDATE `onboarding_task_users_available_dates` SET `provider_available_dates`='"+status+"' where `available_dates_id` IN("+ids+") ";
            console.log(query);
            connection.query(query,
                [], (err, rows) => {
                    if(err) {
                        console.log(err);
                        res.sendData = {"msg":'Server under maintaince',"statuscode":506};
                        middleware.beforeresponse(req,res);
                    }else{
                        connection.release();
                        callback(rows);
                    }
                });
        }
    });
}

onboarding.remindtaskdpu = (data,req,res, callback) => {

    var assigned_task_id = data.id;
    var date = common.getFormattedDatetimemysql(data.datetime);

    sql.getConnection(function(err, connection) {

        if (err) {
            res.sendData = {"msg":'Server under maintaince',"statuscode":503};
            middleware.beforeresponse(req,res);
        }else{

            var query = "INSERT INTO `onboarding_task_provider_remind_on`(`copied_task_id`, `remind_on`, `remind_on_status`) " +
                "VALUES ('"+assigned_task_id+"','"+date+"','1')";
            console.log(query);
            connection.query(query,
                [], (err, rows) => {
                    if(err) {
                        console.log(err);
                        res.sendData = {"msg":'Server under maintaince',"statuscode":506};
                        middleware.beforeresponse(req,res);
                    }else{
                        connection.release();
                        callback(rows);
                    }
                });
        }
    });
}

onboarding.remindtasketeled = (id,req,res, callback) => {

    sql.getConnection(function(err, connection) {
        if (err) {
            res.sendData = {"msg":'Server under maintaince',"statuscode":503};
            middleware.beforeresponse(req,res);
        }else{

            var query = "UPDATE `onboarding_task_provider_remind_on` SET `remind_on_status`='0' where `remind_id`='"+id+"'";
            console.log(query);
            connection.query(query,
                [], (err, rows) => {
                    if(err) {
                        console.log(err);
                        res.sendData = {"msg":'Server under maintaince',"statuscode":506};
                        middleware.beforeresponse(req,res);
                    }else{
                        connection.release();
                        callback(rows);
                    }
                });
        }
    });
}


onboarding.commnetsdetailslist = (userid,id,req,res, callback) => {
    sql.getConnection(function(err, connection) {
        if (err) {
            res.sendData = {"msg":'Server under maintaince',"statuscode":503};
            middleware.beforeresponse(req,res);
        }else{

            var query = "SELECT `commented_user_id`,`comments`,`created_on` FROM `onboarding_task_users_comments` WHERE `copied_task_id`='"+id+"' and type='1' ";
            console.log(query);
            connection.query(query,
                [id], (err, rows) => {
                    if(err) {
                        console.log(err);
                        res.sendData = {"msg":'Server under maintaince',"statuscode":506};
                        middleware.beforeresponse(req,res);
                    }else{
                        connection.release();

                        var details = [];
                        //
                        if(Array.isArray(rows) && rows.length){
                            for(var pLoop=0;pLoop<rows.length;pLoop++)
                            {
                                var usernametitle = 'Admin Commented';
                                if(rows[pLoop].commented_user_id==userid){
                                    usernametitle = 'you Commented';
                                }

                                var commentdate = new Date(rows[pLoop].created_on);

                                details[pLoop] = {
                                    "usernametitle":usernametitle,
                                    "date":common.getFormattedDateop(rows[pLoop].created_on) +' ' + commentdate.getHours()+':'+commentdate.getMinutes()+':'+commentdate.getSeconds() + appconstant.CONSTTIMEZONE,
                                    // "data" : rows[pLoop].created_on,
                                    "comments":rows[pLoop].comments
                                };
                            }
                        }
                        callback(details);
                    }
                });
        }
    });
}

onboarding.inscomtk = (userid,data,req,res, callback) => {

     var id = data.id;
     var comments = data.comments;
     var date = common.getFormattedDatetimemysql(data.datetime);

    sql.getConnection(function(err, connection) {
        if (err) {
            res.sendData = {"msg":'Server under maintaince',"statuscode":503};
            middleware.beforeresponse(req,res);
        }else{

            var query = "INSERT INTO `onboarding_task_users_comments`( `copied_task_id`, `commented_user_id`, `comments`, `type`)" +
                " VALUES ('"+id+"','"+userid+"','"+comments+"','1')";
            console.log(query);
            connection.query(query,
                [id], (err, rows) => {
                    if(err) {
                        console.log(err);
                        res.sendData = {"msg":'Server under maintaince',"statuscode":506};
                        middleware.beforeresponse(req,res);
                    }else{
                        connection.release();

                        callback(rows);
                    }
                });
        }
    });
}


onboarding.gettypestatus = (userid,req,res, callback) => {

    sql.getConnection(function(err, connection) {
        if (err) {
            res.sendData = {"msg":'Server under maintaince',"statuscode":503};
            middleware.beforeresponse(req,res);
        }else{

            var query = "SELECT x.task_category_name,count(a.copied_task_id) as 'task_status', " +

                "(select count(copied_task_id) from onboarding_task_detail_user_assigned where task_category_id=x.task_category_id and assigned_provider_id=?  and assign_status='1') as 'task_count'" +

                " FROM onboarding_task_category as x " +

                " left join onboarding_task_detail_user_assigned as a on " +

                "a.task_category_id = x.task_category_id and a.`assigned_provider_id`=? and is_provider_completed='1' and a.`overall_status`='0' and a.assign_status='1' " +

                " group by x.task_category_id ";
            console.log(query);
            connection.query(query,
                [userid,userid], (err, rows) => {
                    if(err) {
                        console.log(err);
                        res.sendData = {"msg":'Server under maintaince',"statuscode":506};
                        middleware.beforeresponse(req,res);
                    }else{
                        connection.release();

                        var details = [];
                        //
                        if(Array.isArray(rows) && rows.length){
                            for(var pLoop=0;pLoop<rows.length;pLoop++)
                            {
                                var status = 'Completed';
                                if(rows[pLoop].task_status == 0 && rows[pLoop].task_count ==0){
                                    status = 'Pending';
                                }
                                else if(rows[pLoop].task_status == 0 && rows[pLoop].task_count > 0){
                                    status = 'Completed';
                                }else if(rows[pLoop].task_status >0 && rows[pLoop].task_count > 0){
                                    status = 'Pending';
                                }

                                var commentdate = new Date(rows[pLoop].created_on);

                                details[pLoop] = {
                                    "title":rows[pLoop].task_category_name,
                                    "status ":status
                                };
                            }
                        }

                        callback(details);
                    }
                });
        }
    });
}


onboarding.getfileslistupd = (user_id,type,id,limit,items_page, req,res, callback) => {

    sql.getConnection(function(err, connection) {
        if (err) {
            res.sendData = {"msg":'Server under maintaince',"statuscode":503};
            middleware.beforeresponse(req,res);
        }else{



                var query = "select b.task_category_id,a.uploaded_document_id as 'file_id'," +
                    "a.`required_document` as 'download_file',a.`uploaded_document` as 'provider_file',a.`comments` as comments,DATE_FORMAT(DATE(a.`created_on`), \"%m-%d-%Y\") as 'date'," +
                    "'2' as 'type','0' as 'user_id',a.uploaded_document_id" +
                    " from onboarding_task_users_uploaded_document as a " +
                    " left join onboarding_task_detail_user_assigned as b on b.copied_task_id=a.copied_task_id " +
                    " where a.copied_task_id=? limit ?,? ";

            if(type==2){
                var query = " SELECT b.task_category_id,a.`task_comment_id` as 'file_id'," +
                    "a.`attachment` as 'download_file','null' as 'provider_file',a.`comments` as comments,DATE_FORMAT(DATE(a.`created_on`), \"%m-%d-%Y\") as 'date','1' as 'type',a.`commented_user_id` as 'user_id'" +

                    " from onboarding_task_users_comments as a " +
                    " left join onboarding_task_detail_user_assigned as b on b.copied_task_id=a.copied_task_id " +
                    "WHERE a.`copied_task_id`=? and a.type=2 limit ?,? " ;
            }


            console.log(query);
            connection.query(query,
                [id,limit,items_page], (err, rows) => {
                    if(err) {
                        console.log(err);
                        res.sendData = {"msg":'Server under maintaince',"statuscode":506};
                        middleware.beforeresponse(req,res);
                    }else{
                        connection.release();
console.log(rows);
                        var details = [];
                        //
                        if(Array.isArray(rows) && rows.length){
                            for(var pLoop=0;pLoop<rows.length;pLoop++)
                            {
                                var user_type = 1;  console.log(rows[pLoop].user_id);
                                if(rows[pLoop].user_id==user_id){
                                 console.log('fff');   user_type = 2;
                                }

                                var uploadfile_array = {
                                    "uploaded_file_name": '',
                                    "uploaded_file_path": '',
                                    "uploaded_file_date" : '',
                                    "uploaded_id" : ''
                                }

                                if(rows[pLoop].type==2){
                                    uploadfile_array = {
                                        "uploaded_file_name":rows[pLoop].provider_file,
                                        "uploaded_file_path": crypthex.encrypt(common.taskfilelocation(id,rows[pLoop].type,rows[pLoop].task_category_id,2,rows[pLoop].provider_file)),
                                        "uploaded_file_date" : rows[pLoop].date,
                                        "comments ":rows[pLoop].comments,
                                        "uploaded_id" : rows[pLoop].uploaded_document_id
                                    }
                                }

                                var otherfiles_array = [];


                                if(rows[pLoop].type==2){
                                    otherfiles_array[0] = {
                                        "name" : rows[pLoop].download_file,
                                        "file_path" : crypthex.encrypt(common.taskfilelocation(id,rows[pLoop].type,rows[pLoop].task_category_id,user_type,rows[pLoop].download_file))
                                    }
                                }else if(rows[pLoop].type==1){

                                    var splitDownloadfile = JSON.parse(rows[pLoop].download_file);


                                    for(var tst= 0; tst<splitDownloadfile.length;tst++){
                                        otherfiles_array[tst] = {
                                            "name" : splitDownloadfile[tst],
                                            "file_path" : crypthex.encrypt(common.taskfilelocation(id,rows[pLoop].type,rows[pLoop].task_category_id,user_type,splitDownloadfile[tst]))
                                        }
                                    }

                                }





                                details[pLoop] = {
                                    "file_id" : rows[pLoop].file_id,
                                    "uploaded_details" : uploadfile_array,
                                    "download_file" : otherfiles_array,
                                    "type" : rows[pLoop].type
                                };
                            }
                        }

                        callback(details);
                    }
                });
        }
    });

}


onboarding.uploadtaskfile = (taskid,req,res, callback) => {

    sql.getConnection(function(err, connection) {
        if (err) {
            res.sendData = {"msg":'Server under maintaince',"statuscode":503};
            middleware.beforeresponse(req,res);
        }else{

            var query = "SELECT `task_category_id` FROM `onboarding_task_detail_user_assigned` WHERE `copied_task_id`=?" ;

            console.log(query);
            connection.query(query,
                [taskid], (err, rows) => {
                    if(err) {
                        console.log(err);
                        res.sendData = {"msg":'Server under maintaince',"statuscode":506};
                        middleware.beforeresponse(req,res);
                    }else{
                        connection.release();
                        var details = [];
                        callback(rows[0].task_category_id);
                    }
                });
        }
    });

}

onboarding.updateimageuploadcomments = (insertquerybuild,req,res, callback) => {

    sql.getConnection(function(err, connection) {
        if (err) {
            res.sendData = {"msg":'Server under maintaince',"statuscode":503};
            middleware.beforeresponse(req,res);
        }else{

            var query = "INSERT INTO `onboarding_task_users_comments`( `copied_task_id`, `commented_user_id`, `type`, `attachment`) VALUES "+insertquerybuild ;

            console.log(query);
            connection.query(query,
                [], (err, rows) => {
                    if(err) {
                        console.log(err);
                        res.sendData = {"msg":'Server under maintaince',"statuscode":506};
                        middleware.beforeresponse(req,res);
                    }else{
                        connection.release();
                        var details = [];
                        callback(rows);
                    }
                });
        }
    });

}


onboarding.updateimageadminupload = (filesname,uploadid,req,res, callback) => {

    sql.getConnection(function(err, connection) {
        if (err) {
            res.sendData = {"msg":'Server under maintaince',"statuscode":503};
            middleware.beforeresponse(req,res);
        }else{

            var query = "UPDATE `onboarding_task_users_uploaded_document` SET `uploaded_document`='"+filesname+"' where `uploaded_document_id`='"+uploadid+"'";

            console.log(query);
            connection.query(query,
                [], (err, rows) => {
                    if(err) {
                        console.log(err);
                        res.sendData = {"msg":'Server under maintaince',"statuscode":506};
                        middleware.beforeresponse(req,res);
                    }else{
                        connection.release();
                        var details = [];
                        callback(rows);
                    }
                });
        }
    });

}


module.exports = onboarding;