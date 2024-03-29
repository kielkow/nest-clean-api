import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'

import { Env } from '../env'

@Injectable()
export class EnvHelperService {
  constructor(private configService: ConfigService<Env, true>) {}

  get(key: keyof Env): string {
    return this.configService.get(key, { infer: true })
  }
}
