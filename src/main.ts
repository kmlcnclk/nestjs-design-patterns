import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';
import { GlobalExceptionFilter } from './filters/exception-handler.filter';
import { NestExpressApplication } from '@nestjs/platform-express';
import { SuccessResponseInterceptor } from './interceptors/success-response.interceptor';
import { ZodErrorFilter } from './filters/zod-handler.filter';
import { MongooseErrorFilter } from './filters/mongoose-handler.filter';
import { configDotenv } from 'dotenv';

async function bootstrap() {
  configDotenv();

  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    logger: ['error', 'warn', 'log'],
  });

  app.useGlobalFilters(
    new GlobalExceptionFilter(),
    new MongooseErrorFilter(),
    new ZodErrorFilter(),
  );

  app.useGlobalInterceptors(new SuccessResponseInterceptor());

  await app.listen(process.env.PORT || 3000);
  Logger.log(`Server running on ${process.env.MAIN_URL}`, 'Bootstrap');
}
bootstrap();
