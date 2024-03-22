import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();
const email = process.env.EMAIL;
const emailPassword = process.env.EMAIL_PASSWORD

// Function to send email
const sendEmail = async (to, subject, text) => {
    try {
        // Create a transporter object using SMTP transport
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: email,
                pass: emailPassword
            }
        });

        // Define email options
        const mailOptions = {
            from: email,
            to: to,
            subject: subject,
            text: text
        };

        // Send email
        await transporter.sendMail(mailOptions);
        console.log('Email sent successfully');
    } catch (error) {
        console.error('Error sending email:', error);
    }
};

export default sendEmail;