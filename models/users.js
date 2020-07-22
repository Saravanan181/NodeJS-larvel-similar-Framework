const sql = require("./mysqlconnect.js");
var middleware = require('../middleware/reqresmiddleware');
var crypthex = require("../endecrypt/crypthex");
var logconf = require("../config/logconf");
// constructor
const users = function(users) {
    this.email = users.email;
    this.password = users.password;
    this.username = users.username;
};

users.info = (info,req,res, callback) => {

    sql.getConnection(function(err, connection) {
        if (err) {
            var logdata = {"type":'error',"data":err,"customsg":  "database connection error" };
            logconf.writelog(logdata);
            res.sendData = {"msg":'Server under maintaince',"statuscode":503};
            middleware.beforeresponse(req,res);
        }else{
            var query = "SELECT * FROM app_users where username ='"+info.email+"' and password='"+info.password+"' and is_active=1";
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

users.resetpassword = (resetpassword,req,res, callback) => {

    sql.getConnection(function(err, connection) {
        if (err) {
            var logdata = {"type":'error',"data":err,"customsg":  "database connection error" };
            logconf.writelog(logdata);
            res.sendData = {"msg":'Server under maintaince',"statuscode":503};
            middleware.beforeresponse(req,res);
        }else{
            connection.query("UPDATE `app_users` SET `password`='"+resetpassword.password+"',`reset_password`=1 where id='"+resetpassword.id+"'",
                [], (err, userData) => {
                if(err) {
                    var logdata = {"type":'error',"data":err,"customsg":  "Query error" };
                    logconf.writelog(logdata);
                    res.sendData = {"msg":'Server under maintaince',"statuscode":503};
                    middleware.beforeresponse(req,res);
                }else{
                    connection.release();
            callback(userData);
        }
        });
        }
    });

}

users.validateUser = (info,req,res, callback) => {  console.log(info);
    sql.getConnection(function(err, connection) {
        if (err) {
            res.sendData = {"msg":'Server under maintaince',"statuscode":503};
            middleware.beforeresponse(req,res);
        }else{
            connection.query("SELECT * FROM app_users where username =?",
                [info.username], (err, userData) => {
                if(err){
                    var logdata = {"type":'error',"data":err,"customsg":  "Query error" };
                    logconf.writelog(logdata);
                    res.sendData = {"msg":'Server under maintaince',"statuscode":503};
                    middleware.beforeresponse(req,res);
                }else{
                    connection.release();
            callback(userData);
        }
        });
        }
    });
}

module.exports = users;