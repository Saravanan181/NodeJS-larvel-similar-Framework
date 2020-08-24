const sql = require("./mysqlconnect.js");
var middleware = require('../middleware/reqresmiddleware');
var crypthex = require("../endecrypt/crypthex");
var logconf = require("../config/logconf");
var appconstant = require("../config/appconstant");

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
            var query = "SELECT CAST(AES_DECRYPT(`name`,'"+appconstant.MYSQLENCRYPTKEY+"') as CHAR) as name," +
                " CAST(AES_DECRYPT(`email`,'"+appconstant.MYSQLENCRYPTKEY+"') as CHAR) as email," +
                "  CAST(AES_DECRYPT(`location`,'"+appconstant.MYSQLENCRYPTKEY+"') as CHAR) as location, pt_id, reset_password " +
                " FROM physiotherapist where email = AES_ENCRYPT('"+info.email+"','"+appconstant.MYSQLENCRYPTKEY+"')  and organization_id = '"+info.orgid+"' and password=AES_ENCRYPT('"+info.password+"','"+appconstant.MYSQLENCRYPTKEY+"') and status=1";
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

            var query = "UPDATE `physiotherapist` SET `password`=AES_ENCRYPT('"+resetpassword.password+"','"+appconstant.MYSQLENCRYPTKEY+"'),`reset_password`=1 where email=AES_ENCRYPT('"+resetpassword.username+"','"+appconstant.MYSQLENCRYPTKEY+"') and organization_id =AES_ENCRYPT('"+resetpassword.orgid+"','"+appconstant.MYSQLENCRYPTKEY+"') ";
            console.log(query);
            connection.query(query,
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

users.chpss = (changepassword,req,res, callback) => {

    sql.getConnection(function(err, connection) {
        if (err) {
            var logdata = {"type":'error',"data":err,"customsg":  "database connection error" };
            logconf.writelog(logdata);
            res.sendData = {"msg":'Server under maintaince',"statuscode":503};
            middleware.beforeresponse(req,res);
        }else{

            var query = "UPDATE `physiotherapist` SET `password`=AES_ENCRYPT('"+changepassword.password+"','"+appconstant.MYSQLENCRYPTKEY+"'),`reset_password`=0 where pt_id=AES_ENCRYPT('"+changepassword.id+"','"+appconstant.MYSQLENCRYPTKEY+"')  and organization_id =AES_ENCRYPT('"+changepassword.orgid+"','"+appconstant.MYSQLENCRYPTKEY+"') ";
            console.log(query);
            connection.query( query,
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

            var query = "SELECT CAST(AES_DECRYPT(`name`,'"+appconstant.MYSQLENCRYPTKEY+"') as CHAR) as name," +
                " CAST(AES_DECRYPT(`email`,'"+appconstant.MYSQLENCRYPTKEY+"') as CHAR) as email," +
                "  CAST(AES_DECRYPT(`location`,'"+appconstant.MYSQLENCRYPTKEY+"') as CHAR) as location, pt_id, reset_password " +
                " FROM physiotherapist where pt_id ='"+info.id+"'  and organization_id = '"+res.orgData.id+"' ";

            console.log(query);
            connection.query(query,
                [], (err, userData) => {
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