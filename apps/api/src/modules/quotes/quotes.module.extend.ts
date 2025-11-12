import { Module } from '@nestjs/common';
import { PrismaModule } from '../../common/prisma/prisma.module';
import { QuotesPdfService } from './quotes.pdf';
import { QuotesSendController } from './quotes.controller.extend';
import { PdfModule } from '../../pdf/pdf.module';

@Module({
  imports: [PrismaModule, PdfModule],
  providers: [QuotesPdfService],
  controllers: [QuotesSendController],
})
export class QuotesSendModule {}
