import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DurationInterceptor } from './interceptors/duration.interceptor';
import * as dotenv from "dotenv";
import { ConfigService } from '@nestjs/config';
import * as bodyParser from 'body-parser';
import { exec } from "child_process";
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import { RedisIoAdapter } from './socket/redis-io.adapter';

dotenv.config();


async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  // const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  app.use(bodyParser.json({ limit: '50mb' }));
  app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
  if (configService.get("NODE_ENV") == "production") {
    const redisIoAdapter = new RedisIoAdapter(app);
    await redisIoAdapter.connectToRedis();
    // redisIoAdapter.
    app.useWebSocketAdapter(redisIoAdapter);
  }

  app.enableCors();
  app.setBaseViewsDir(join(__dirname, 'views'));
  app.setViewEngine('hbs');
  app.useGlobalPipes(new ValidationPipe(
    {
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
      // disableErrorMessages: true,
    }
  ));
  app.useGlobalInterceptors(new DurationInterceptor());
  await app.listen(configService.get("APP_PORT", "0.0.0.0"));
}

bootstrap();



// npm run compodoc
// npm run lint
// TZ=UTC nest...