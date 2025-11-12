import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailerService {
  private transporter: nodemailer.Transporter;

  constructor() {
    const host = process.env.EMAIL_SMTP_HOST || 'localhost';
    const port = Number(process.env.EMAIL_SMTP_PORT || 1025);
    const user = process.env.EMAIL_SMTP_USER;
    const pass = process.env.EMAIL_SMTP_PASS;
    const secure = !!process.env.EMAIL_SMTP_SECURE;

    this.transporter = nodemailer.createTransport({
      host,
      port,
      secure,
      auth: user && pass ? { user, pass } : undefined,
    });
  }

  async sendMail(params: { to: string; subject: string; text?: string; html?: string; attachments?: any[] }) {
    const from = process.env.EMAIL_FROM || 'demo@example.com';
    return this.transporter.sendMail({ from, ...params });
  }
}
