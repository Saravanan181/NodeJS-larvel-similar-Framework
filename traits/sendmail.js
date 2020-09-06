var nodemailer = require('nodemailer');
var path = require('path');
var handlebars = require('handlebars');
var fs = require('fs');




// constructor
const sendmail = function() {

};


var readHTMLFile = function(path, callback) {
    fs.readFile(path, {encoding: 'utf-8'}, function (err, html) {
        if (err) {
            throw err;
            callback(err);
        }
        else {
            callback(null, html);
        }
    });
};

sendmail.sendresetpassword = (data) => {

    let transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 465,
        secure: true, // true for 465, false for other ports
        auth: {
            user: '@gmail.com', // generated ethereal user
            pass: '908661273217' // generated ethereal password
        }
    });

    readHTMLFile(path.resolve()+'/template/resetpassword/resetpassword.html', function(err, html) {
        var template = handlebars.compile(html);
        var replacements = {
            tempassword: data.password
        };

        console.log(replacements);
        var htmlToSend = template(replacements);

        let info = transporter.sendMail({
                    from: '@gmail.com', // sender address
                    to: data.mail, // list of receivers
                    subject: data.subject, // Subject line
                    // text: "Hello world?", // plain text body
                    html: htmlToSend // html body
                });

                return info;

    });

}


module.exports = sendmail;