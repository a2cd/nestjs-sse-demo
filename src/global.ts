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
    super(`${EventKey.CLIENT}.${clientId}`, data);
    this.clientId = clientId;
  }
}

export class RedisKey {
  public static BLOCK_LIST: string = 'block-list';
}

export class EventKey {
  public static REDIS_BLPOP: string = 'redis.blpop';
  public static CLIENT: string = 'client';
}
