import { Injectable } from '@nestjs/common';
import Redis, { RedisOptions } from 'ioredis';
import { Callback } from 'ioredis/built/types';
import cfg from './cfg-reader';
const redisOptions: RedisOptions = {
  host: cfg.redis.host,
  port: cfg.redis.port,
  username: cfg.redis.username,
  password: cfg.redis.password,
  db: cfg.redis.db,
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
