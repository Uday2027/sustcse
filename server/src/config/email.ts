import nodemailer from 'nodemailer';
import { env } from './env';

export const transporter = nodemailer.createTransport({
  host: env.SMTP_HOST,
  port: parseInt(env.SMTP_PORT),
  secure: false,
  auth: {
    user: env.SMTP_USER,
    pass: env.SMTP_PASS,
  },
});

// Verify SMTP connection on startup
transporter.verify()
  .then(() => console.log('SMTP connection verified successfully'))
  .catch((err) => console.error('SMTP connection failed:', err.message));
