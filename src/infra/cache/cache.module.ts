import { Module } from '@nestjs/common'

import { EnvHelperModule } from '../env-helper/env-helper.module'

import { RedisService } from './redis/redis.service'

import { CacheRepository } from './cache-repository'
import { RedisCacheRepository } from './redis/redis-cache-repository'

@Module({
  imports: [EnvHelperModule],
  providers: [
    RedisService,
    {
      provide: CacheRepository,
      useClass: RedisCacheRepository,
    },
  ],
  exports: [CacheRepository],
})
export class CacheModule {}
