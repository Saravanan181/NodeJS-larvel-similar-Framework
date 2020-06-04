
// constructor
const common = function() {

};

common.getFormattedDateop = (date) => {
        var todayTime = new Date(date);
        var month = todayTime.getMonth()+1;
        var day = todayTime.getDate();
        var year = todayTime.getFullYear();
        return month + "-" + day + "-" + year;
}

common.getFormattedDatemysql = (date) => {
        var todayTime = new Date(date);
        var month = todayTime.getMonth()+1;
        var day = todayTime.getDate();
        var year = todayTime.getFullYear();
        return year+"-"+month+"-"+day;
}
module.exports = common;