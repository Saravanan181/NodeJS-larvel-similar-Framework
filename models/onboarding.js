const sql = require("./mysqlconnect.js");
var middleware = require('../middleware/reqresmiddleware');
var crypthex = require("../endecrypt/crypthex");
var appconstant = require("../config/appconstant");
var common = require("../traits/common");
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
                                }else if(rows[pLoop].is_provider_completed==1){
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

            var query = "SELECT a.assigned_provider_id,a.copied_task_id as reminder_id,a.task_description,a.created_at as created_date, " +
                "a.copied_task_id as task_id,a.task_name,a.due_date,a.is_provider_completed, "+
            " group_concat(DATE_FORMAT(DATE(available_dates), \"%m %d %Y\"),' ',from_time,' ',to_time,'$$',provider_available_dates,'$$',available_dates_id) as available_date, "+
            // " group_concat(remind_on,'$$',remind_id) as remind_date "+
            " group_concat(DATE_FORMAT(remind_on, \"%m %d %Y %H:%i:%s\"),'$$',remind_id) as remind_date "+
            " FROM `onboarding_task_detail_user_assigned` as a " +
            " left join onboarding_task_users_available_dates as c on c.copied_task_id=a.copied_task_id " +
            " left join onboarding_task_provider_remind_on as d on " +
            " d.copied_task_id=a.copied_task_id and d.remind_on_status='1'" +
            " where a.copied_task_id=? group by c.copied_task_id ";
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

            var query = "INSERT INTO `onboarding_task_provider_remind_on`(`assigned_task_id`, `remind_on`, `remind_on_status`) " +
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

            var query = "SELECT `commented_user_id`,`comments`,`created_on` FROM `onboarding_task_users_comments` WHERE `assigned_task_id`='"+id+"' and type='1' ";
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

            var query = "INSERT INTO `onboarding_task_users_comments`( `assigned_task_id`, `commented_user_id`, `comments`, `type`, `created_on`)" +
                " VALUES ('"+id+"','"+userid+"','"+comments+"','1','"+date+"')";
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

                "(select count(copied_task_id) from onboarding_task_detail_user_assigne where task_category_id=x.task_category_id and assigned_provider_id=?  and assign_status='1') as 'task_count'" +

                " FROM onboarding_task_category as X " +

                " left join onboarding_task_detail_user_assigned as a on " +

                "a.task_category_id = x.task_category_id and a.`assigned_provider_id`=? and a.`overall_status`='0' and a.assign_status='1' " +

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
                                if(rows[pLoop].task_status == 0 && rows[pLoop].task_count > 0){
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

module.exports = onboarding;