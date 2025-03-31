import { env } from '@src/config/env.config';
import nodemailer from 'nodemailer';
import Mail from 'nodemailer/lib/mailer';

export class MailService {
  private transporter: Mail;

  constructor() {
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      host: 'smtp.gmail.com',
      port: 587,
      secure: false,
      auth: {
        user: env.MAIL_USERNAME,
        pass: env.MAIL_PASSWORD,
      },
    });
  }

  sendmail = async (mailDetails: Omit<Mail.Options, 'from'>) => {
    try {
      await this.transporter.sendMail({
        ...mailDetails,
        from: `Furniture Store <${env.MAIL_USERNAME}>`,
      });
    } catch (error) {
      console.log(error);
    }
  };
}
