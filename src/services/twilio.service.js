import twilio from 'twilio';
import dotenv from 'dotenv';

dotenv.config();

console.log("TWILIO_ACCOUNT_SID:", process.env.TWILIO_ACCOUNT_SID);
console.log("TWILIO_AUTH_TOKEN:", process.env.TWILIO_AUTH_TOKEN ? "OK" : "MISSING");

const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

export class TwilioService {
    static async sendMessage({ to, body }) {
        try {
            const message = await client.messages.create({
                body,
                from: process.env.TWILIO_PHONE_NUMBER,
                to
            });

            console.log(`Mensaje enviado a ${to}: ${message.sid}`);
            return message;
        } catch (error) {
            console.error('Error enviando mensaje con Twilio:', error.message);
            throw new Error('No se pudo enviar el mensaje');
        }
    }
}
