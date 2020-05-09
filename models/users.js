const sql = require("./mysqlconnect.js");
var middleware = require('../middleware/reqresmiddleware');

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
        }else{}
        // console.log('ddd');
        connection.query("SELECT * FROM users where email_id =? and otp=?",
            [info.email, info.otp], (err, userData) => {
            if(err) {
                res.sendData = {"msg":'Server under maintaince',"statuscode":503};
                middleware.beforeresponse(req,res);
            }else{
                    connection.end();
                    callback(userData);

            }
        });
    });

    // console.log('ddd');
    // sql.query("SELECT * FROM users where email_id =? and otp=?",
    //     [info.email, info.otp], (err, userData) => {
    //     if(err) {
    //         console.log("error: ", err);
    //         result(err, null);
    //         return;
    //     }else{
    //
    //             callback(userData);
    //
    //     }
    // });

}

users.hospital = (info,callback) => {


    sql.query("SELECT hl.hospital_id,hl.hospital_name FROM `add_physician_hospital` as aph " +
        "left join hospital_list as hl on aph.hospital_id=hl.hospital_id " +
        "WHERE aph.`physician_id`=?",
        [info], (err, hospitalList) => {
        if (err) {
            console.log("error: ", err);
            result(err, null);
            return;
        }else{

            callback(hospitalList);


}
});

}

module.exports = users;