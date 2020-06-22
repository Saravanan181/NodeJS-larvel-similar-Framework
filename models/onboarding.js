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

            var query = "SELECT a.created_on as created_date, b.copied_task_id as task_id,b.task_name,a.due_date,a.is_provider_completed FROM `onboarding_task_detail_user_assigned` as a " +

                        " left join onboarding_task_detail_user as b on b.copied_task_id=a.copied_task_id "+

                        " where a.`assigned_provider_id`='"+physican_id+"' and a.is_internal_resource_completed='"+1+"' and b.task_category_id='"+type+"' limit ?,? ";
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
                                    "due_date":common.getFormattedDateop(rows[pLoop].due_date),
                                    "task_id":rows[pLoop].task_id,
                                    "created_date":common.getFormattedDateop(rows[pLoop].created_date),
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

            var query = "SELECT b.task_description,a.created_on as created_date, b.copied_task_id as task_id,b.task_name,a.due_date,a.is_provider_completed, "+
            " group_concat(DATE(available_dates),' ',from_time,' ',to_time,'$$',provider_available_dates,'$$',available_dates_id) as available_date "+
            " FROM `onboarding_task_detail_user_assigned` as a " +
            " left join onboarding_task_detail_user as b on b.copied_task_id=a.copied_task_id " +
            " left join onboarding_task_users_available_dates as c on c.copied_task_id=a.copied_task_id " +
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

                            var date_av = rows[0].available_date.split(',');
                            var date_avail = [];

                            if(Array.isArray(date_av) && date_av.length){
                                for(var pIloop=0;pIloop<date_av.length;pIloop++)
                                {
                                    var provided_check = date_av[pIloop].split('$$');
                                    console.log(provided_check);
                                    date_avail[pIloop] = {
                                        "is_selected" : parseInt(provided_check[1]),
                                        "date" : provided_check[0],
                                        "available_date_id" : provided_check[2],
                                    };
                                }
                            }

                            details = {
                                "task_name" : rows[0].task_name,
                                "task_id" : rows[0].task_id,
                                "due_date" : common.getFormattedDateop(rows[0].due_date),
                                "created_date" : common.getFormattedDateop(rows[0].created_date),
                                "task_description" : rows[0].task_description,
                                "available_date" : date_avail
                            }
                        }
                        callback(details);
                    }
                });
        }
    });
}

onboarding.availabledateupdate = (data,req,res, callback) => {

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


module.exports = onboarding;