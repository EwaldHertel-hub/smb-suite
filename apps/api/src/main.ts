import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { ValidationPipe } from "@nestjs/common";
import { registerPdfWorker } from './pdf/pdf.worker';
import { QueueService } from './queue/queue.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { bufferLogs: true });
  const queue = app.get(QueueService);
  registerPdfWorker(queue);
  app.enableCors({ origin: [/localhost:3000$/], credentials: true });
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
  await app.listen(process.env.PORT ?? 3001);
}
bootstrap();
