import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { RedisService } from './redis.service';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { LongRunningService } from './long-running.service';
import { EventListener } from './event-listener';

@Module({
  imports: [EventEmitterModule.forRoot({ wildcard: true })],
  controllers: [AppController],
  providers: [AppService, RedisService, LongRunningService, EventListener],
})
export class AppModule {}
