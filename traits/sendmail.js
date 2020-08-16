const nodemailer = require("nodemailer");

// constructor
const sendmail = function() {

};


sendmail.send = (data) => {

    let transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 465,
        secure: true, // true for 465, false for other ports
        auth: {
            user: 'noreply.amble@gmail.com', // generated ethereal user
            pass: 'cewcttxkusqrcubj' // generated ethereal password
        }
    });

    let info = transporter.sendMail({
        from: 'noreply.amble@gmail.com', // sender address
        to: data.mail, // list of receivers
        subject: data.subject, // Subject line
        // text: "Hello world?", // plain text body
        html: data.html // html body
    });

    return info;

}


module.exports = sendmail;