import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { SubjectManager } from './subject-manager';
import { ClientEventPayload, EventKey, EventPayload } from './global';

@Injectable()
export class EventListener {
  @OnEvent(`${EventKey.CLIENT}.*`)
  handleClientEvents(payload: ClientEventPayload) {
    const subject = SubjectManager.m.get(payload.clientId);
    subject.next(payload.data);
    console.log(`收到'client.*' event: ${payload.event}, data=${payload.data}`);
  }

  @OnEvent(EventKey.REDIS_BLPOP)
  handleBlocklistEvents(payload: EventPayload) {
    for (const [, v] of SubjectManager.m.entries()) {
      if (v.observed) {
        v.next(payload.data);
      }
    }
    console.log(
      `收到'redis.blpop' event: ${payload.event}, data=${payload.data}`,
    );
  }
}
