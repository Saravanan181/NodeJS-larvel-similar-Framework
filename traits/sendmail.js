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
            user: 'no.reply.ethos09@gmail.com', // generated ethereal user
            pass: 'etho5@09' // generated ethereal password
        }
    });

    let info = transporter.sendMail({
        from: 'amble@noreply.com', // sender address
        to: data.mail, // list of receivers
        subject: data.subject, // Subject line
        // text: "Hello world?", // plain text body
        html: data.html // html body
    });

    return info;

}


module.exports = sendmail;