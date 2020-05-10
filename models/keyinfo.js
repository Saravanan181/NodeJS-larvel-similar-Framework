const sql = require("./mysqlconnect.js");
var middleware = require('../middleware/reqresmiddleware');

// constructor
const keyinfo = function() {

};

keyinfo.hospitalinfo = (hospital_id,callback) => {

    sql.getConnection(function(err, connection) {
        if (err) {
            res.sendData = {"msg":'Server under maintaince',"statuscode":503};
            middleware.beforeresponse(req,res);
        }else{
            connection.query("SELECT key_param,key_value FROM `hospital_keyinfo` WHERE `hospital_id` = ? and type = ? ORDER BY `hospital_keyinfo`.`id` ASC",
                [hospital_id,0], (err, keyinfoDetails) => {
                    if(err) {
                        res.sendData = {"msg":'Server under maintaince',"statuscode":503};
                        middleware.beforeresponse(req,res);
                    }else{
                        connection.end();
                        connection.query("SELECT id,hospital_id,block_name FROM `hospital_category` WHERE `hospital_id` = ? ORDER BY `hospital_category`.`id` ASC",
                            [hospital_id], (err, keycategoryDetails) => {
                                if(err) {
                                    res.sendData = {"msg":'Server under maintaince',"statuscode":503};
                                    middleware.beforeresponse(req,res);
                                }else{
                                    // var details = {"keyinfoDetails":keyinfoDetails,"keycategoryDetails":keycategoryDetails};

                                    connection.end();
                                    callback(keyinfoDetails,keycategoryDetails);
                                }
                            });

                    }
                });
        }
    });
}

module.exports = keyinfo;