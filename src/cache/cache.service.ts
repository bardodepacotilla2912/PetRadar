import { Injectable } from '@nestjs/common';
import Redis from 'ioredis';
import { envs } from 'src/conf/envs';

@Injectable()
export class CacheService {
  private readonly redis = new Redis({
    host: envs.REDIS_HOST,
    port: envs.REDIS_PORT,
  });

  async set(key: string, value: any, ttlSeconds: number): Promise<void> {
    const json = JSON.stringify(value);
    if (ttlSeconds > 0) {
      await this.redis.set(key, json, 'EX', ttlSeconds);
    } else {
      await this.redis.set(key, json);
    }
  }

  async get<T>(key: string): Promise<T | null> {
    const data = await this.redis.get(key);
    if (!data) return null;
    return JSON.parse(data) as T;
  }

  async del(key: string): Promise<void> {
    await this.redis.del(key);
  }
}
