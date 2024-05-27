import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import cfg from './cfg-reader';

async function bootstrap() {
  console.log(cfg);
  const app = await NestFactory.create(AppModule);
  app.enableCors(); // 允许跨域
  await app.listen(cfg.server.port);
  console.log(`Listening on http://localhost:${cfg.server.port}`);
}

bootstrap();
