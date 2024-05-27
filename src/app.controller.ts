import { Controller, Get, Param, Sse } from '@nestjs/common';
import { AppService } from './app.service';
import { interval, map, Observable, Subject } from 'rxjs';
import { RedisService } from './redis.service';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { SubjectUtil } from './common';
import { ClientEventPayload } from './event-listener';
@Controller('/app')
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly redisService: RedisService,
    private readonly eventEmitter2: EventEmitter2,
  ) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('/query')
  async query(): Promise<string> {
    return await this.appService.query();
  }
  @Sse('/sse/1')
  sse1(): Observable<any> {
    // 连接时的id
    // 断开连接时的id
    return new Observable((subscriber) => {
      subscriber.next('hello');
      subscriber.next('world');
      subscriber.complete();
    });
    // return interval(3000).pipe(map((id) => ({ data: `hello world ${id}` })));
  }

  @Sse('/sse/2')
  sse2(): Observable<any> {
    return interval(3000).pipe(map((id) => ({ data: `hello world ${id}` })));
  }

  /**
   * 开启sse
   */
  @Sse('/sse/connect/:clientId')
  sseConnect(@Param('clientId') clientId: string): Observable<any> {
    const subject = new Subject();
    SubjectUtil.m.set(clientId, subject);
    return subject;
  }

  /**
   * 清除所有不使用的SSE连接
   */
  @Get('/sse/clear-idle')
  sseClearIdle(): string {
    for (const [k, v] of SubjectUtil.m.entries()) {
      if (!v.observed) {
        v.error('关闭信号');
        v.complete();
        v.unsubscribe();
        SubjectUtil.m.delete(k);
        console.log(`清除idle sse: '${k}'`);
      }
    }
    return `clear all idle sse OK`;
  }

  /**
   * 清除所有的SSE连接
   */
  @Get('/sse/clear-all')
  sseClearAll(): string {
    for (const [k, v] of SubjectUtil.m.entries()) {
      v.error('关闭信号');
      v.complete();
      v.unsubscribe();
      SubjectUtil.m.delete(k);
      console.log(`清除idle sse: '${k}'`);
    }
    return `clear all sse OK`;
  }

  /**
   * 查询客户端是否还在监听
   */
  @Get('/event/observed/:event')
  observed(@Param('event') event: string): string {
    const subject = SubjectUtil.m.get(event);
    const o = subject.observed;
    return `浏览器是否连接: '${o}'`;
  }

  /**
   * 发送消息
   */
  @Get('/event/:clientId/:text')
  async emit(
    @Param('clientId') clientId: string,
    @Param('text') text: string,
  ): Promise<string> {
    const payload = new ClientEventPayload(clientId, text);
    await this.eventEmitter2.emitAsync(payload.event, payload);
    return 'OK';
  }

  /**
   * get
   */
  @Get('/redis/get')
  async redisGet(): Promise<string> {
    return await this.redisService.get('hhh', (err, result) => {
      console.log('err:', err);
      console.log('result:', result);
    });
  }

  /**
   * 向list中添加1000个元素
   */
  @Get('/redis/rpush')
  async redisRPush(): Promise<string> {
    const list: string[] = [];
    for (let i = 0; i < 1000; i++) {
      list.push(String(i));
    }
    await this.redisService.client().rpush('block-list', ...list);
    return 'OK';
  }
}
