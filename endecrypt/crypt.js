
var crypto = require('crypto');
var assert = require('assert');

var algorithm = 'aes-256-cbc';
const IV = "5183666c72eec9e4";
const IV_LENGTH = 16;
var key = 'NNbGOFx4Db16i21c6RSbLEgoTSOLRgdk';

// constructor
const crypt = function(cryptData) {
    this.algorithm = 'aes256';
    this.key = 'NNbGOFx4Db16i21c6RSbLEgoTSOLRgdk';
};


crypt.encrypt = (data,callback) => {

    var cipher = crypto.createCipher(algorithm, key);
    let encrypted = cipher.update(data, 'utf8', 'base64');
     encrypted += cipher.final('base64');
    callback(encrypted);

}

crypt.decrypt = (data,callback) => {

    let decipher = crypto.createDecipher(algorithm, key);
    let decrypted = decipher.update(data, 'base64', 'utf8');
    callback(decrypted + decipher.final('utf8'));

}


crypt.encryptreturn = (data) => {
    console.log(data);
    var cipher = crypto.createCipheriv(algorithm, key, IV );
    let encrypted = cipher.update(data, 'utf8', 'base64');
    encrypted += cipher.final('base64');
    return encrypted;

}


crypt.decryptreturn = (data) => {

    let decipher = crypto.createDecipheriv(algorithm, key, IV);
    let decrypted = decipher.update(data, 'base64', 'utf8');
    return decrypted + decipher.final('utf8');

}

module.exports = crypt;