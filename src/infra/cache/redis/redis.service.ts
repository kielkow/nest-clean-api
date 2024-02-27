import { Redis } from 'ioredis'
import { Injectable, OnModuleDestroy } from '@nestjs/common'

import { EnvHelperService } from '@/infra/env-helper/env-helper.service'

@Injectable()
export class RedisService extends Redis implements OnModuleDestroy {
  constructor(envHelperService: EnvHelperService) {
    const host = envHelperService.get('REDIS_HOST')
    const port = Number(envHelperService.get('REDIS_PORT'))
    const password = envHelperService.get('REDIS_PASSWORD')
    const db = Number(envHelperService.get('REDIS_DB'))

    super({
      host,
      port,
      password,
      db,
    })
  }

  async onModuleDestroy() {
    this.disconnect()
  }
}
