
var crypto = require('crypto');
var assert = require('assert');

var algorithm = 'aes-256-cbc';
const IV = "5183666c72eec9e4";
const IV_LENGTH = 16;
var key = 'NNbGOFx4Db16i21c6RSbLEgoTSOLRgdk';

// constructor
const crypthex = function(cryptData) {
    this.algorithm = 'aes256';
    this.key = 'NNbGOFx4Db16i21c6RSbLEgoTSOLRgdk';
};


crypthex.encrypt = (data) => {
// return data;
    var cipher = crypto.createCipheriv(algorithm, key, IV );
    let encrypted = cipher.update(data, 'utf8', 'hex');
    return encrypted += cipher.final('hex');

}

crypthex.decrypt = (data) => {
// return data;
    let decipher = crypto.createDecipheriv(algorithm, key, IV);
    let decrypted = decipher.update(data, 'hex', 'utf8');
    return decrypted + decipher.final('utf8');

}


module.exports = crypthex;