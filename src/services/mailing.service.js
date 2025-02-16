import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

export class MailingService {
    static async sendMail({ to, subject, html }) {
        try {
            const transporter = nodemailer.createTransport({
                host: process.env.SMTP_HOST || "smtp.mailtrap.io",
                port: process.env.SMTP_PORT || 2525,
                secure: process.env.SMTP_SECURE === "true", // Para TLS/SSL
                auth: {
                    user: process.env.EMAIL_USER,
                    pass: process.env.EMAIL_PASS
                }
            });

            const mailOptions = {
                from: `"Sales Center" <${process.env.EMAIL_USER}>`,
                to,
                subject,
                html
            };

            const info = await transporter.sendMail(mailOptions);
            console.log('Correo enviado:', info.messageId);
            return info;
        } catch (error) {
            console.error('Error enviando correo:', error.message);
            throw new Error('No se pudo enviar el correo');
        }
    }
}
