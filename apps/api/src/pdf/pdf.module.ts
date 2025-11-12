import { Module } from '@nestjs/common';
import { PdfService } from './pdf.service';
import { PdfController } from './pdf.controller';
import { QueueModule } from '../queue/queue.module';
import { MailerModule } from '../mailer/mailer.module';
import { PdfListener } from './pdf.listener';
import { PrismaModule } from '../common/prisma/prisma.module';

@Module({
  imports: [QueueModule, MailerModule, PrismaModule],
  providers: [PdfService, PdfListener],
  controllers: [PdfController],
  exports: [PdfService],
})
export class PdfModule {}
