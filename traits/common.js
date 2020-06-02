
// constructor
const common = function() {

};

common.getFormattedDate = (date) => {
        var todayTime = new Date(date);
        var month = todayTime.getMonth();
        var day = todayTime.getDate();
        var year = todayTime.getFullYear();
        return month + "-" + day + "-" + year;
}
module.exports = common;