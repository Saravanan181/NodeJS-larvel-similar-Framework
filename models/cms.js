const sql = require("./mysqlconnect.js");
var logconf = require("../config/logconf");
// constructor
const cms = function(cms) {

};


cms.getpage = (id,req,res, callback) => {
    sql.getConnection(function(err, connection) {
        if (err) {
            res.sendData = {"msg":'Server under maintaince',"statuscode":503};
            middleware.beforeresponse(req,res);
        }else{
            connection.query("SELECT * FROM `cms_page` where id =? and is_active=1",
                [id], (err, cms) => {
                if(err){
                    var logdata = {"type":'error',"data":err,"customsg":  "Query error" };
                    logconf.writelog(logdata);
                    res.sendData = {"msg":'Server under maintaince',"statuscode":503};
                    middleware.beforeresponse(req,res);
                }else{
                    connection.release();
            callback(cms);
        }
        });
        }
    });
}

module.exports = cms;