import { Module } from '@nestjs/common';
import { PrismaModule } from '../../common/prisma/prisma.module';
import { InvoicesPdfService } from './invoices.pdf';
import { InvoicesSendController } from './invoices.controller.extend';
import { PdfModule } from '../../pdf/pdf.module';

@Module({
  imports: [PrismaModule, PdfModule],
  providers: [InvoicesPdfService],
  controllers: [InvoicesSendController],
})
export class InvoicesSendModule {}
