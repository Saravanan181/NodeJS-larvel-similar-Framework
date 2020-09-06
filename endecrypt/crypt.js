
var crypto = require('crypto');
var assert = require('assert');

var algorithm = 'aes-256-cbc';
const IV = "5183666c72eec9e4";
const IV_LENGTH = 16;
var key = 'NNbGOFx4Db16i21c6RSbLEgoTSOLRgdk';
// var iv = key.substr(0,16);

// constructor
const crypt = function(cryptData) {
    this.algorithm = 'aes-256-cbc';
    this.key = 'NNbGOFx4Db16i21c6RSbLEgoTSOLRgdk';
};




crypt.encrypt = (data,callback) => {
    console.log(data);
    var cipher = crypto.createCipheriv(algorithm, key, IV );
    let encrypted = cipher.update(data, 'utf8', 'base64');
    encrypted += cipher.final('base64');
    callback(encrypted);

}

crypt.decrypt = (data,callback) => {

    let decipher = crypto.createDecipheriv(algorithm, key, IV);
    let decrypted = decipher.update(data, 'base64', 'utf8');
    callback(decrypted + decipher.final('utf8'));

}


// crypt.encrypt = (data,callback) => {
//
//
//     // var encryptor = crypto.createCipher(algorithm, key);
//     // callback(encryptor.update(data, 'utf8', 'base64') + encryptor.final('base64'));
//     //
//     // // var encryptor = crypto.createCipheriv(algorithm, key, iv);
//     // // let buff = new Buffer(encryptor.update(data, 'utf8', 'base64') + encryptor.final('base64'));
//     // // callback(buff.toString('base64'));
//     //
//     //
//     // // var encryptor = crypto.createCipher(algorithm, key);
//     // //
//     // // // const encrypted = cipher.update(data);
//     // //
//     // // callback(encryptor.update(data, 'utf8', 'base64') + encryptor.final('base64'));
//     //
//     // // const token = Buffer.concat([encrypted, cipher.final()])
//     // // callback(token.toString('base64'));
//
//     let encrypted = cipher.update(data, 'utf8', 'base64');
//      encrypted += cipher.final('base64');
//     callback(encrypted);
//
// }
//
// crypt.decrypt = (data,callback) => {
//     //
//     //
//     // // let buff = new Buffer(data, 'base64');
//     // // let datatext = buff.toString('ascii');
//     //
//     // var decryptor = crypto.createDecipher(algorithm, key);
//     // callback(decryptor.update(data, 'base64', 'utf8') + decryptor.final('utf8'));
//     //
//     // // const [iv, ciphertext] = token.split(".").map(piece => Buffer.from(piece, 'base64'))
//     // // const decipher = crypto.createDecipher(algorithm, key);
//     // //
//     // // callback(decipher.update(data, 'base64', 'utf8') + decipher.final('utf8'));
//     //
//     // // const output = decipher.update(data)
//     // // callback(Buffer.concat([output, decipher.final()]).toString('utf8'));
//
//
//     let decipher = crypto.createDecipher(algorithm, key, iv);
//     let decrypted = decipher.update(data, 'base64', 'utf8');
//     callback(decrypted + decipher.final('utf8'));
//
// }


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