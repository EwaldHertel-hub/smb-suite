import { Injectable, OnModuleDestroy } from '@nestjs/common';
import { Queue, Worker, QueueEvents, JobsOptions } from 'bullmq';
import { RedisOptions } from 'ioredis';

export type PdfJobPayload = {
  type: 'quote' | 'invoice';
  id: string;
  html: string;
  outPath: string;
  email?: { to: string; subject: string; text?: string };
};

@Injectable()
export class QueueService implements OnModuleDestroy {
  public readonly pdfQueue: Queue<PdfJobPayload>;
  public readonly pdfEvents: QueueEvents;
  private workers: Worker[] = [];

  constructor() {
    const connection: RedisOptions = { maxRetriesPerRequest: null, enableReadyCheck: false, lazyConnect: false, connectionName: 'smb-suite' , host: undefined };
    // BullMQ reads REDIS_URL from env if not provided; keep simple by passing string URL via connection option
    const url = process.env.REDIS_URL || 'redis://localhost:6379';
    // @ts-ignore
    connection.url = url;

    this.pdfQueue = new Queue<PdfJobPayload>('pdf', { connection });
    this.pdfEvents = new QueueEvents('pdf', { connection });
  }

  addPdfJob(data: PdfJobPayload, opts: JobsOptions = { removeOnComplete: true, removeOnFail: 50 }) {
    return this.pdfQueue.add('render', data, opts);
  }

  registerWorker(worker: Worker) {
    this.workers.push(worker);
  }

  async onModuleDestroy() {
    await this.pdfQueue.close();
    await this.pdfEvents.close();
    await Promise.all(this.workers.map(w => w.close()));
  }
}
