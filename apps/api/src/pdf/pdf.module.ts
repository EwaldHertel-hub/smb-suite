import { Module } from '@nestjs/common';
import { PdfService } from './pdf.service';
import { PdfController } from './pdf.controller';
import { QueueModule } from '../queue/queue.module';
import { MailerModule } from '../mailer/mailer.module';

@Module({
  imports: [QueueModule, MailerModule],
  providers: [PdfService],
  controllers: [PdfController],
  exports: [PdfService],
})
export class PdfModule {}
