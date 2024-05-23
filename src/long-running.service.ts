import { Injectable } from '@nestjs/common';
import { RedisService } from './redis.service';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { EventPayload } from './event.service';

@Injectable()
export class LongRunningService {
  constructor(
    private readonly redisService: RedisService,
    private readonly eventEmitter2: EventEmitter2,
  ) {
    console.log('block-list-listener listening');
    const r = this.redisService.client().duplicate();
    new Promise(async () => {
      while (true) {
        // blpop返回kv数组
        const kv = await r.blpop('block-list', 0);
        const payload = new EventPayload('redis.blpop', kv[1]);
        await this.eventEmitter2.emitAsync(payload.event, payload);
        await this.sleep(2000);
      }
    }).then(() => {});
  }

  /**
   * 模拟休眠
   * @param ms 毫秒
   */
  private sleep(ms): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}
