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
            var query = "INSERT INTO `patient`(`patient_id`, `patient_name`, `gender`, `age`, `time_post_stokes`, `walking_speed`, `notes`) " +
                "VALUES ('"+info.patientid+"','"+info.name+"','"+info.gender+"','"+info.age+"'," +
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



patient.search = (id,req,res, callback) => {


    sql.getConnection(function(err, connection) {
        if (err) {
            var logdata = {"type":'error',"data":err,"customsg":  "database connection error" };
            logconf.writelog(logdata);
            res.sendData = {"msg":'Server under maintaince',"statuscode":503};
            middleware.beforeresponse(req,res);
        }else{
            var query = "SELECT * FROM `patient` WHERE `patient_id` = ?";
            console.log(query);
            connection.query(query,
                [id], (err, patientDetail) => {

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