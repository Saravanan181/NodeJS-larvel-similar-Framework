const sql = require("./mysqlconnect.js");
var middleware = require('../middleware/reqresmiddleware');
var crypthex = require("../endecrypt/crypthex");

// constructor
const users = function(users) {
    this.email = users.email;
    this.password = users.password;
    this.username = users.username;
};

users.info = (info,req,res, callback) => {

    sql.getConnection(function(err, connection) {
        if (err) {
            res.sendData = {"msg":'Server under maintaince',"statuscode":503};
            middleware.beforeresponse(req,res);
        }else{
            connection.query("SELECT * FROM users where email_id =? and otp=?",
                [info.email, info.otp], (err, userData) => {
                    if(err) {
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

users.hospital = (info,req,res, callback) => {
    sql.getConnection(function(err, connection) {
        if (err) {
            res.sendData = {"msg":'Server under maintaince',"statuscode":503};
            middleware.beforeresponse(req,res);
        }else{}
        // console.log('ddd');
        connection.query("SELECT hl.hospital_id,hl.hospital_name FROM `add_physician_hospital` as aph " +
            "left join hospital_list as hl on aph.hospital_id=hl.hospital_id " +
            "WHERE aph.`physician_id`=?",
            [info], (err, rows) => {
                if (err) {
                    res.sendData = {"msg":'Server under maintaince',"statuscode":503};
                    middleware.beforeresponse(req,res);
                }else{
                    connection.release();

                    var hospitalList = [];

                    if(Array.isArray(rows) && rows.length){
                        for(var pIloop=0;pIloop<rows.length;pIloop++)
                        {
                            if(rows[pIloop]){
                                crypthex.encrypt(JSON.stringify(rows[pIloop].hospital_id),function(encryptId){
                                    hospitalList[pIloop] = {
                                        "hospital_id":encryptId,
                                        "hospital_name":rows[pIloop].hospital_name
                                    };
                                });
                            }
                        }
                    }


                    callback(hospitalList);
                }
            });
    });
}

users.validateUser = (info,req,res, callback) => {
    sql.getConnection(function(err, connection) {
        if (err) {
            res.sendData = {"msg":'Server under maintaince',"statuscode":503};
            middleware.beforeresponse(req,res);
        }else{
            connection.query("SELECT * FROM users where email_id =?",
                [info.username], (err, userData) => {
                    if(err){
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