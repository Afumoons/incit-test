import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: Number(process.env.EMAIL_PORT),
    secure: false, // true for 465, false for other ports
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

export const sendVerificationEmail = async (email: string, token: string) => {
    const mailOptions = {
        from: '"Maddison Foo Koch 👻" <maddison53@ethereal.email>', // sender address
        to: email,
        subject: 'Email Verification',
        text: `Please verify your email by clicking the following link: ${process.env.FRONTEND_URL}/verify-email?token=${token}`,
        html: `<strong>Please verify your email by clicking the following link: <a href="${process.env.FRONTEND_URL}/verify-email?token=${token}">Verify Email</a></strong>`,
    };

    await transporter.sendMail(mailOptions);
};
