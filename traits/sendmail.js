const nodemailer = require("nodemailer");

// constructor
const sendmail = function() {

};


sendmail.send = (data,callback) => {

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
        from: 'saravagmail.com', // sender address
        to: "saravanan.j@innoppl.com", // list of receivers
        subject: data.title, // Subject line
        // text: "Hello world?", // plain text body
        html: data.subject // html body
    });

    console.log("Message sent: %s", info);
    // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

    // Preview only available when sending through an Ethereal account
    console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));

}


module.exports = sendmail;