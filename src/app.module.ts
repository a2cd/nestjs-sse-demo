import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaService } from './prisma.service';
import { RedisService } from './redis.service';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { LongRunningService } from './long-running.service';
import { EventService } from './event.service';

@Module({
  imports: [EventEmitterModule.forRoot({ wildcard: true })],
  controllers: [AppController],
  providers: [
    AppService,
    PrismaService,
    RedisService,
    LongRunningService,
    EventService,
  ],
})
export class AppModule {}
