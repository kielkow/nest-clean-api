import { Redis } from 'ioredis'
import { OnModuleDestroy } from '@nestjs/common'

import { EnvHelperService } from '@/infra/env-helper/env-helper.service'

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

  async getCache(key: string): Promise<string | null> {
    return await this.get(key)
  }

  async setCache(key: string, value: string): Promise<void> {
    await this.set(key, value)
  }

  async deleteCache(key: string): Promise<void> {
    await this.del(key)
  }
}
