import nodemailer from "nodemailer";

export const sendEmail = async(options) => {
    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.EMAIL_USERNAME,      // YOUR APP EMAIL
            pass: process.env.EMAIL_PASSWORD,      // YOUR APP PASSWORD
        }
    });

    const mailOptions = {
        from: process.env.EMAIL_USERNAME,
        to: options.email,
        subject: options.subject,
        html: options.message
    };

    await transporter.sendMail(mailOptions);
}