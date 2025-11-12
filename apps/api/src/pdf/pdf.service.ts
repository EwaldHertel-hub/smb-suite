import { Injectable } from '@nestjs/common';
import { QueueService, PdfJobPayload } from '../queue/queue.service';
import { MailerService } from '../mailer/mailer.service';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class PdfService {
  constructor(private queue: QueueService, private mailer: MailerService) {}

  ensureDir(filePath: string) {
    const dir = path.dirname(filePath);
    fs.mkdirSync(dir, { recursive: true });
  }

  async enqueueInvoice(args: { id: string; html: string; email?: { to: string; subject: string; text?: string } }) {
    const outPath = path.join(process.cwd(), 'storage', 'pdfs', `invoice-${args.id}.pdf`);
    this.ensureDir(outPath);
    const job: PdfJobPayload = { type: 'invoice', id: args.id, html: args.html, outPath, email: args.email };
    return this.queue.addPdfJob(job);
  }

  async enqueueQuote(args: { id: string; html: string; email?: { to: string; subject: string; text?: string } }) {
    const outPath = path.join(process.cwd(), 'storage', 'pdfs', `quote-${args.id}.pdf`);
    this.ensureDir(outPath);
    const job: PdfJobPayload = { type: 'quote', id: args.id, html: args.html, outPath, email: args.email };
    return this.queue.addPdfJob(job);
  }
}
