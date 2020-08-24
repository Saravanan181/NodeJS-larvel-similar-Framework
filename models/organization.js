const sql = require("./mysqlconnect.js");
var middleware = require('../middleware/reqresmiddleware');
var crypthex = require("../endecrypt/crypthex");
var logconf = require("../config/logconf");
var appconstant = require("../config/appconstant");

// constructor
const organization = function(organization) {

};

organization.info = (id, req, res, callback) => {

    sql.getConnection(function(err, connection) {
        if (err) {
            var logdata = {"type":'error',"data":err,"customsg":  "database connection error" };
            logconf.writelog(logdata);
            res.sendData = {"msg":'Server under maintaince',"statuscode":503};
            middleware.beforeresponse(req,res);
        }else{
            var query = "SELECT CAST(AES_DECRYPT(`name`,'"+appconstant.MYSQLENCRYPTKEY+"') as CHAR) as name," +
                " CAST(AES_DECRYPT(`email`,'"+appconstant.MYSQLENCRYPTKEY+"') as CHAR) as email," +
                "  CAST(AES_DECRYPT(`location`,'"+appconstant.MYSQLENCRYPTKEY+"') as CHAR) as location, organization_id " +
                " FROM organization where barcode ='"+id+"' and status=1";
            console.log(query);
            connection.query(query,
                [], (err, organizationData) => {

                    if(err) {
                        var logdata = {"type":'error',"data":err,"customsg":  "Query error" };
                        logconf.writelog(logdata);
                        res.sendData = {"msg":'Server under maintaince',"statuscode":503};
                        middleware.beforeresponse(req,res);
                    }else{console.log(organizationData);
                        connection.release();
                        callback(organizationData);
                    }
                });
        }
    });

}


module.exports = organization;