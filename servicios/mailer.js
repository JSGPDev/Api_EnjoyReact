const nodemailer = require('nodemailer');

const enviarcorreo = (para, asunto, cuerpo) => {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.MAILER_MAIL,
            pass: process.env.MAILER_PASS
        }
    });

    const mailOptions = {
        from: process.env.MAILER_MAIL,
        to: para,
        subject: asunto,
        html: cuerpo
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error('Error al enviar el correo:', error);
        } else {
            console.log('Correo electrónico enviado:', info.response);
        }
        transporter.close();
    });
}

module.exports = enviarcorreo;
