import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { PrismaModule } from "./common/prisma/prisma.module";
import { AuthModule } from "./modules/auth/auth.module";
import { OrganizationsModule } from "./modules/organizations/organizations.module";
import { ClientsModule } from "./modules/clients/clients.module";
import { QuotesModule } from "./modules/quotes/quotes.module";
import { InvoicesModule } from "./modules/invoices/invoices.module";
import { PaymentsModule } from "./modules/payments/payments.module";
import { PdfModule } from "./pdf/pdf.module";
import { MailerModule } from "./mailer/mailer.module";
import { QueueModule } from "./queue/queue.module";
import { QuotesSendModule } from "./modules/quotes/quotes.module.extend";
import { InvoicesSendModule } from "./modules/invoices/invoices.module.extend";
import { UsersModule } from './modules/users/users.module';
import { ProjectsModule } from "./modules/projects/projects.module";
import { TasksModule } from "./modules/tasks/tasks.module";

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    AuthModule,
    OrganizationsModule,
    ClientsModule,
    QuotesModule,
    InvoicesModule,
    PaymentsModule,
    QueueModule,
    MailerModule,
    PdfModule,
    QuotesSendModule,
    InvoicesSendModule,
    UsersModule,
    ProjectsModule,
    TasksModule,
  ],
})
export class AppModule {}
