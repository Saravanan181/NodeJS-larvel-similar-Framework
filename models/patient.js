const sql = require("./mysqlconnect.js");
var middleware = require('../middleware/reqresmiddleware');
var crypthex = require("../endecrypt/crypthex");
var logconf = require("../config/logconf");
// constructor
const patient = function(patient) {
};

patient.add = (info,req,res, callback) => {


    sql.getConnection(function(err, connection) {
        if (err) {
            var logdata = {"type":'error',"data":err,"customsg":  "database connection error" };
            logconf.writelog(logdata);
            res.sendData = {"msg":'Server under maintaince',"statuscode":503};
            middleware.beforeresponse(req,res);
        }else{
            var query = "INSERT INTO `patient`(`organization_id`,`patient_id`, `patient_name`, `gender`, `dob`, `time_post_stokes`, `walking_speed`, `notes`) " +
                "VALUES ('"+info.orgid+"','"+info.patientid+"','"+info.name+"','"+info.gender+"','"+info.dob+"'," +
                "'"+info.time_post_stroke+"','"+info.walking_speed+"','"+info.notes+"')";
            console.log(query);
            connection.query(query,
                [], (err, userData) => {

                    if(err) {
                        var logdata = {"type":'error',"data":err,"customsg":  "Query error" };
                        logconf.writelog(logdata);
                        res.sendData = {"msg":'Server under maintaince',"statuscode":503};
                        middleware.beforeresponse(req,res);
                    }else{console.log(userData);
                        connection.release();
                        callback(userData);
                    }
                });
        }
    });

}



patient.search = (orgid, id, req, res, callback) => {


    sql.getConnection(function(err, connection) {
        if (err) {
            var logdata = {"type":'error',"data":err,"customsg":  "database connection error" };
            logconf.writelog(logdata);
            res.sendData = {"msg":'Server under maintaince',"statuscode":503};
            middleware.beforeresponse(req,res);
        }else{
            var query = "SELECT * FROM `patient` WHERE `patient_id`  LIKE '%"+id+"%' and organization_id='"+orgid+"'";
            console.log(query);
            connection.query(query,
                [], (err, patientDetail) => {

                if(err) {
                    var logdata = {"type":'error',"data":err,"customsg":  "Query error" };
                    logconf.writelog(logdata);
                    res.sendData = {"msg":'Server under maintaince',"statuscode":503};
                    middleware.beforeresponse(req,res);
                }else{console.log(patientDetail);
            connection.release();
            callback(patientDetail);
        }
        });
        }
    });

}


module.exports = patient;