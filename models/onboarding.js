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
                                if(rows[pLoop].is_provider_completed==0){
                                    var status = 'Incomplete';
                                }else if(rows[pLoop].is_provider_completed==1){
                                    var status = 'Completed';
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

module.exports = onboarding;