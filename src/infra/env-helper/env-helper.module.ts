import { Module } from '@nestjs/common'

import { EnvHelperService } from './env-helper.service'

@Module({
  providers: [EnvHelperService],
  exports: [EnvHelperService],
})
export class EnvHelperModule {}
