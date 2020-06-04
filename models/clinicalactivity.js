const sql = require("./mysqlconnect.js");
var middleware = require('../middleware/reqresmiddleware');
var crypthex = require("../endecrypt/crypthex");
var appconstant = require("../config/appconstant");
var common = require("../traits/common");
// constructor
const clinicalactivity = function() {

};

clinicalactivity.encounterinfo = (hospital_id,req,res, callback) => {
    sql.getConnection(function(err, connection) {
        if (err) {
            res.sendData = {"msg":'Server under maintaince',"statuscode":503};
            middleware.beforeresponse(req,res);
        }else{
            connection.query("SELECT encounter_name,id FROM `hospital_encounter_type` WHERE `hospital_id` = ? ORDER BY `hospital_encounter_type`.`encounter_name` ASC",
                [hospital_id], (err, encounterTypes) => {
                    if(err) {
                        console.log(err);
                        res.sendData = {"msg":'Server under maintaince',"statuscode":503};
                        middleware.beforeresponse(req,res);
                    }else{
                        connection.release();
                        callback(encounterTypes);
                    }
                });
        }
    });
}

clinicalactivity.diagnosis = (req,res, callback) => {
    sql.getConnection(function(err, connection) {
        if (err) {
            res.sendData = {"msg":'Server under maintaince',"statuscode":503};
            middleware.beforeresponse(req,res);
        }else{
            connection.query("SELECT field_id as id,diagnosis FROM `diagnosis` WHERE `status` = ? ORDER BY `diagnosis` ASC",
                [1], (err, diagnosis) => {
                    if(err) {
                        res.sendData = {"msg":'Server under maintaince',"statuscode":503};
                        middleware.beforeresponse(req,res);
                    }else{
                        connection.release();
                        callback(diagnosis);
                    }
                });
        }
    });
}



clinicalactivity.codes = (req,res, callback) => {
    sql.getConnection(function(err, connection) {
        if (err) {
            res.sendData = {"msg":'Server under maintaince',"statuscode":503};
            middleware.beforeresponse(req,res);
        }else{
            connection.query("SELECT encounter_type,id FROM `hospital_encounter_type` WHERE `hospital_id` = ? ORDER BY `hospital_encounter_type`.`encounter_name` ASC",
                [hospital_id,0], (err, encounterTypes) => {
                    if(err) {
                        res.sendData = {"msg":'Server under maintaince',"statuscode":503};
                        middleware.beforeresponse(req,res);
                    }else{
                        connection.release();
                        callback(encounterTypes);
                    }
                });
        }
    });
}

clinicalactivity.insertdiagonis = (data,req,res, callback) => {
    if(data.data==0){
        sql.getConnection(function(err, connection) {
            if (err) {
                res.sendData = {"msg":'Server under maintaince',"statuscode":503};
                middleware.beforeresponse(req,res);
            }else{
                connection.query("INSERT INTO `diagnosis`(`diagnosis`, `status`) VALUES (?,?)",
                    [data.data,data.status], (err, result) => {
                        if(err) {
                            res.sendData = {"msg":'Server under maintaince',"statuscode":506};
                            middleware.beforeresponse(req,res);
                        }else{
                            connection.release();console.log(result.insertId);
                            callback(result.insertId);
                        }
                    });
            }
        });
    }else{
        callback(data.data);
    }

}

clinicalactivity.insertClinicallog = (data,req,res, callback) => {
        sql.getConnection(function(err, connection) {
            if (err) {
                res.sendData = {"msg":'Server under maintaince',"statuscode":503};
                middleware.beforeresponse(req,res);
            }else{

                var valuearray = [data.provider_id,data.hospital_id,data.patient_first_name,data.patient_last_name,
                    data.patient_mrn,data.dob,data.encounter_type,data.cpi_code,data.consults_hours,
                    data.diagonis_type,data.service_date,data.shift_date];

                if(data.activity_log!=0){
                    var query ="UPDATE `cross_cover_details` SET `provider_id`=?,`hospital_id`=?,`patient_first_name`=?," +
                        "`patient_last_name`=?,`patient_mrn`=?,`dob`=?,`encounter_type`=?,`cpi_code`=?," +
                        "`consults_hours`=?,`diagonis_type`=?,`service_date`=?,`shift_date`=? WHERE `cross_cover_details_id`=?";
                    valuearray.push(data.activity_log);
                }else{
                    var query = "INSERT INTO `cross_cover_details`(`provider_id`, `hospital_id`, " +
                        "`patient_first_name`, `patient_last_name`, `patient_mrn`, `dob`, " +
                        "`encounter_type`, `cpi_code`, `consults_hours`, `diagonis_type`, `service_date`, " +
                        "`shift_date`, `statuss`) " +
                        "VALUES (?,?," +
                        "?,?,?,?," +
                        "?,?,?,?,?," +
                        "?,?)";
                    valuearray.push(data.status);
                }

                connection.query(query,valuearray
                    , (err, result) => {
                        if(err) {
                            console.log(err);
                            res.sendData = {"msg":'Server under maintaince',"statuscode":506};
                            middleware.beforeresponse(req,res);
                        }else{
                            connection.release();
                            callback(result);
                        }
                    });
            }
        });
}

clinicalactivity.clinicalloglist = (physican_id,limit,items_page,status,req,res,datas, callback) => {
    sql.getConnection(function(err, connection) {
        if (err) {
            res.sendData = {"msg":'Server under maintaince',"statuscode":503};
            middleware.beforeresponse(req,res);
        }else{
            var conditions = '';

            if (datas.hasOwnProperty('pageno')) {

                if(datas.start_date!='' && datas.end_date!=''){
                     conditions = "cross_cover_details.shift_date BETWEEN '"+ common.getFormattedDatemysql(datas.start_date) +"' and '"+ common.getFormattedDatemysql(datas.end_date) +"'";
                }else if(datas.start_date!=''){
                     conditions = "cross_cover_details.shift_date >= '"+ common.getFormattedDatemysql(datas.start_date) +"'";
                }else if(datas.end_date!=''){
                     conditions = "cross_cover_details.shift_date <= '"+ common.getFormattedDatemysql(datas.end_date) +"'";
                }

                if(datas.hospital_id!=''){
                    if(conditions!=''){
                        conditions += ' and ';
                    }

                     conditions += "cross_cover_details.hospital_id <= '"+ datas.hospital_id +"'";
                }

            }else{
                 conditions = "cross_cover_details.`provider_id` = '"+physican_id+"' and cross_cover_details.statuss = '"+status+"'";
            }

            var query = "SELECT cross_cover_details.*,diagnosis.status as diagnosis_status,diagnosis.diagnosis,hospital_encounter_type.encounter_name," +
                "hospital_list.hospital_name FROM `cross_cover_details` " +
                " left join hospital_list on cross_cover_details.hospital_id = hospital_list.hospital_id " +
                " left join hospital_encounter_type on cross_cover_details.encounter_type = hospital_encounter_type.id " +
                " left join diagnosis on cross_cover_details.diagonis_type = diagnosis.field_id " +
                " WHERE "+conditions+" limit ?,?";
            console.log(query);
            connection.query(query,
                [limit,items_page], (err, rows) => {
                    if(err) {
                        console.log(err);
                        res.sendData = {"msg":'Server under maintaince',"statuscode":506};
                        middleware.beforeresponse(req,res);
                    }else{
                        connection.release();
                        var list = [];

                        if(Array.isArray(rows) && rows.length){
                            for(var pLoop=0;pLoop<rows.length;pLoop++)
                            {
                                var diagonsis = '-';
                                var diagonsis_custom = '-';
                                if(rows[pLoop].diagnosis_status==1){
                                    diagonsis = rows[pLoop].diagnosis;
                                }else if(rows[pLoop].diagnosis_status==2){
                                    diagonsis_custom = rows[pLoop].diagnosis;
                                }

                                list[pLoop] = {
                                    "id":rows[pLoop].id,
                                    "patient_first_name":rows[pLoop].patient_first_name,
                                    "patient_last_name":rows[pLoop].patient_last_name,
                                    "patient_mrn":rows[pLoop].patient_mrn,
                                    "dob":common.getFormattedDateop(rows[pLoop].dob),
                                    "cpi_code":rows[pLoop].cpi_code,
                                    "consults_hours":rows[pLoop].consults_hours,
                                    "service_date":common.getFormattedDateop(rows[pLoop].service_date),
                                    "shift_date":common.getFormattedDateop(rows[pLoop].shift_date),
                                    "diagonsis":rows[pLoop].id,
                                    "other_diagonis":rows[pLoop].item_name,
                                    "hospital_name":rows[pLoop].hospital_name,
                                    "encounter_type":rows[pLoop].encounter_name,
                                    "diagonsis":diagonsis,
                                    "diagonsis_custom":diagonsis_custom
                                };
                            }
                        }
                        callback(list);
                    }
                });
        }
    });
}

module.exports = clinicalactivity;