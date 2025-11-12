import { Controller, Get, Post, Body, Param, ParseIntPipe } from '@nestjs/common';
import { QuotesService } from './quotes.service';
import { CreateQuoteDto } from './quotes.dto';


@Controller('quotes')
export class QuotesController {
constructor(private readonly svc: QuotesService) {}
@Post() create(@Body() dto: CreateQuoteDto) { return this.svc.create(dto); }
@Get(':number') byNumber(@Param('number', ParseIntPipe) number: number) { return this.svc.byNumber(number); }
@Post(':id/send') send(@Param('id') id: string) { return this.svc.send(id); }
@Post(':id/to-invoice') toInvoice(@Param('id') id: string) { return this.svc.toInvoice(id); }
}