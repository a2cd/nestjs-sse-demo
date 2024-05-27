import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { SubjectManager } from './subject-manager';
import { ClientEventPayload, EventKey, EventPayload } from './global';

@Injectable()
export class EventListener {
  @OnEvent(`${EventKey.CLIENT}.*`)
  handleClientEvents(payload: ClientEventPayload) {
    const subject = SubjectManager.m.get(payload.clientId);
    subject.next(payload.data); // 向指定连接发送消息
    console.log(`收到${payload.event}, data=${payload.data}`);
  }

  @OnEvent(EventKey.REDIS_BLPOP)
  handleBlockListEvents(payload: EventPayload) {
    // 向所有连接都发一遍消息
    for (const [, v] of SubjectManager.m.entries()) {
      if (v.observed) {
        v.next(payload.data); // 客户端处于监听状态的才发
      }
    }
    console.log(`收到${payload.event}, data=${payload.data}`);
  }
}
