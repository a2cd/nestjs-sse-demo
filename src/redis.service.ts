import { Injectable } from '@nestjs/common';
import Redis, { RedisOptions } from 'ioredis';
import { Callback } from 'ioredis/built/types';

const redisOptions: RedisOptions = {
  host: 'localhost',
  port: 6379,
  password: '',
  db: 0,
};

@Injectable()
export class RedisService {
  private readonly redisClient: Redis;
  constructor() {
    this.redisClient = new Redis(redisOptions);
  }
  client(): Redis {
    return this.redisClient;
  }
  async set(key: string, value: string): Promise<void> {
    await this.redisClient.set(key, value);
  }
  async get(key: string, callback?: Callback<string | null>): Promise<string> {
    return this.redisClient.get(key, callback);
  }
}
