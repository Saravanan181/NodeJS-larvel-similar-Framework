const sql = require("./mysqlconnect.js");


// constructor
const keyinfo = function() {

};

keyinfo.info = (info,callback) => {

    sql.query("SELECT * FROM users where email_id =? and otp=?",
        [info.email, info.otp], (err, userData) => {
        if (err) {
            console.log("error: ", err);
            result(err, null);
            return;
        }else{

                callback(userData);


        }
    });

}

module.exports = keyinfo;