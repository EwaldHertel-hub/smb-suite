import { QueueService } from '../queue/queue.service';
import { Worker } from 'bullmq';
import * as fs from 'fs';
import * as path from 'path';

export function registerPdfWorker(queue: QueueService) {
  const connection = { url: process.env.REDIS_URL || 'redis://localhost:6379' };
  const worker = new Worker('pdf', async job => {
    const data = job.data;
    const puppeteer = await import('puppeteer');
    const browser = await puppeteer.launch({ args: ['--no-sandbox', '--disable-setuid-sandbox'] });
    const page = await browser.newPage();
    await page.setContent(data.html, { waitUntil: 'networkidle0' });
    const pdfBuffer = await page.pdf({ format: 'A4', printBackground: true, margin: { top: '16mm', bottom: '16mm', left: '12mm', right: '12mm' } });
    await browser.close();

    fs.mkdirSync(path.dirname(data.outPath), { recursive: true });
    fs.writeFileSync(data.outPath, pdfBuffer);

    if (data.email) {
      // Send e-mail with attachment by calling Mailer service via dynamic import to avoid circular deps
      const { default: nodemailer } = await import('nodemailer');
      const transport = nodemailer.createTransport({
        host: process.env.EMAIL_SMTP_HOST || 'localhost',
        port: Number(process.env.EMAIL_SMTP_PORT || 1025),
        secure: !!process.env.EMAIL_SMTP_SECURE,
        auth: process.env.EMAIL_SMTP_USER && process.env.EMAIL_SMTP_PASS ? { user: process.env.EMAIL_SMTP_USER, pass: process.env.EMAIL_SMTP_PASS } : undefined
      });
      await transport.sendMail({
        from: process.env.EMAIL_FROM || 'demo@example.com',
        to: data.email.to,
        subject: data.email.subject,
        text: data.email.text,
        attachments: [{ filename: path.basename(data.outPath), path: data.outPath }]
      });
    }

    return { outPath: data.outPath };
  }, { connection });

  queue.registerWorker(worker);

  return worker;
}
