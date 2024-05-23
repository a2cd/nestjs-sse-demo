import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { SubjectUtil } from './common';

export class EventPayload {
  event: string;
  data: string;

  constructor(event: string, data: string) {
    this.event = event;
    this.data = data;
  }
}

export class ClientEventPayload extends EventPayload {
  clientId: string;

  constructor(clientId: string, data: string) {
    super(`client.${clientId}`, data);
    this.clientId = clientId;
  }
}

@Injectable()
export class EventService {
  @OnEvent('client.*')
  handleClientEvents(payload: ClientEventPayload) {
    const subject = SubjectUtil.m.get(payload.clientId);
    subject.next(payload.data);
    console.log(`收到'client.*' event: ${payload.event}, data=${payload.data}`);
  }

  @OnEvent('redis.blpop')
  handleBlocklistEvents(payload: EventPayload) {
    for (const [, v] of SubjectUtil.m.entries()) {
      if (v.observed) {
        v.next(payload.data);
      }
    }
    console.log(
      `收到'redis.blpop' event: ${payload.event}, data=${payload.data}`,
    );
  }
}
