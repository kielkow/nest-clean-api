import { Module } from '@nestjs/common'

import { RedisService } from './redis/redis.service'
import { EnvHelperModule } from '../env-helper/env-helper.module'
import { EnvHelperService } from '../env-helper/env-helper.service'

@Module({
  imports: [EnvHelperModule],
  providers: [EnvHelperService, RedisService],
  exports: [RedisService],
})
export class CacheModule {}
