
var crypto = require('crypto');
var assert = require('assert');

var algorithm = 'aes256';

var key = 'NNbGOFx4Db16i21c6RSbLEgoTSOLRgdk';

// constructor
const crypt = function(cryptData) {
    this.algorithm = 'aes256';
    this.key = 'NNbGOFx4Db16i21c6RSbLEgoTSOLRgdk';
};


crypt.encrypt = (data,callback) => {

    var cipher = crypto.createCipher(algorithm, key);
    var encrypted = cipher.update(data, 'utf8', 'hex') + cipher.final('hex');

    callback(encrypted);

}

crypt.decrypt = (data,callback) => {

    var decipher = crypto.createDecipher(algorithm, key);
    var decrypted = decipher.update(data, 'hex', 'utf8') + decipher.final('utf8');

    callback(decrypted);

}




module.exports = crypt;