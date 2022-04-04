require('dotenv').config()
const nodeMailer = require('nodemailer')


const sendMail = async (req, token) => {
    const transporter = nodeMailer.createTransport({
      host: process.env.EMAIL_HOST,
      service: 'gmail',
      port: 587,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    });
  
    await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: req.body.email,
        subject: "Password RESET",
        text: `Follow this link to reset your password. It expires in 15minutes. \n\n
         http://${req.headers.host}/reset/${token}`,
    });
}

module.exports = sendMail