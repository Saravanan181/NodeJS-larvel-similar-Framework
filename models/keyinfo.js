const sql = require("./mysqlconnect.js");
var middleware = require('../middleware/reqresmiddleware');
var crypthex = require("../endecrypt/crypthex");
var appconstant = require("../config/appconstant")
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
                        connection.query("SELECT id,block_name FROM `hospital_category` WHERE `hospital_id` = ? ORDER BY `hospital_category`.`id` ASC",
                            [hospital_id], (err, keycategoryDetails) => {
                                if(err) {
                                    res.sendData = {"msg":'Server under maintaince',"statuscode":503};
                                    middleware.beforeresponse(req,res);
                                }else{
                                    connection.release();
                                    callback(keyinfoDetails,keycategoryDetails);
                                }
                            });
                    }
                });
        }
    });
}


keyinfo.sectionlist = (category_id,limit,items_page,req,res, callback) => {
    sql.getConnection(function(err, connection) {
        if (err) {
            res.sendData = {"msg":'Server under maintaince',"statuscode":503};
            middleware.beforeresponse(req,res);
        }else{
            connection.query("SELECT * FROM `hospital_category_item` WHERE `category_id` = ? and status = ? limit ?,?",
                [category_id,0,limit,items_page], (err, rows) => {
                    if(err) {
                        res.sendData = {"msg":'Server under maintaince',"statuscode":503};
                        middleware.beforeresponse(req,res);
                    }else{
                        connection.release();
                        var sectionlist = [];

                        if(Array.isArray(rows) && rows.length){
                            for(var pLoop=0;pLoop<rows.length;pLoop++)
                            {
                                var imageInfo = rows[pLoop].file_path.split(',');
                                var imageDetails = [];

                                if(Array.isArray(imageInfo) && imageInfo.length){
                                    for(var pIloop=0;pIloop<imageInfo.length;pIloop++)
                                    {
                                        // if(imageInfo[pIloop]){
                                        //     crypthex.encrypt(JSON.stringify(imageInfo[pIloop]),function(encryptImageInfo){

                                                imageDetails[pIloop] = {
                                                    "name":appconstant.SECTIONLISTURL+imageInfo[pIloop]
                                                };
                                        //     });
                                        // }
                                    }
                                }

                                sectionlist[pLoop] = {
                                    "section_id":rows[pLoop].id,
                                    "section_name":rows[pLoop].item_name,
                                    "section_description":rows[pLoop].item_description,
                                    "files_path": imageDetails
                                };
                            }
                        }
                        callback(sectionlist);
                    }
                });
        }
    });
}


module.exports = keyinfo;