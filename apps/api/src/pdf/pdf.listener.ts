import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { QueueService } from '../queue/queue.service';
import { PrismaService } from '../common/prisma/prisma.service';

@Injectable()
export class PdfListener implements OnModuleInit {
  private readonly logger = new Logger(PdfListener.name);

  constructor(private queue: QueueService, private prisma: PrismaService) {}

  async onModuleInit() {
    this.queue.pdfEvents.on("completed", async (payload: any) => {
      const { jobId, returnvalue } = payload ?? {};
      try {
        const job = await this.queue.pdfQueue.getJob(jobId);
        if (!job) return;
        const data = job.data as any;

        const eventReturn = returnvalue ?? (job as any).returnvalue;
        const outPath = eventReturn?.outPath ?? data.outPath;

        if (data.type === "quote") {
          await this.prisma.quote.update({
            where: { id: data.id },
            data: { pdfUrl: outPath },
          });
        } else if (data.type === "invoice") {
          await this.prisma.invoice.update({
            where: { id: data.id },
            data: { pdfUrl: outPath },
          });
        }

        this.logger.log(
          `PDF stored at ${outPath} and saved to ${data.type}:${data.id}`
        );
      } catch (e) {
        this.logger.error(`Failed to persist PDF for job ${jobId}`, e as any);
      }
    });
  }
}
