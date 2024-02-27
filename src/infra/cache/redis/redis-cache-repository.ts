import { Injectable } from '@nestjs/common'

import { RedisService } from './redis.service'
import { CacheRepository } from '../cache-repository'

@Injectable()
export class RedisCacheRepository implements CacheRepository {
  constructor(private readonly redisService: RedisService) {}

  async get(key: string): Promise<string | null> {
    return await this.redisService.get(key)
  }

  async set(key: string, value: string): Promise<void> {
    await this.redisService.set(key, value, 'EX', 60 * 60 * 24)
  }

  async delete(key: string): Promise<void> {
    await this.redisService.del(key)
  }
}
