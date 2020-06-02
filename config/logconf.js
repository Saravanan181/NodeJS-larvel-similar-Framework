const log = require('log-to-file');

// constructor
const logconf = function() {

};

logconf.writelog = (info,req) => {
    var filename = new Date().toISOString().slice(0,10)+'.log';
    log(info.customsg + '\r\n' + info.data, './logs/'+info.type+filename);
}

module.exports = logconf;
