import { Module } from '@nestjs/common'

import { Uploader } from '@/domain/forum/application/storage/uploader'

import { R2Storage } from './r2-storage'
import { EnvHelperModule } from '../env-helper/env-helper.module'

@Module({
  imports: [EnvHelperModule],
  providers: [
    {
      provide: Uploader,
      useClass: R2Storage,
    },
  ],
  exports: [Uploader],
})
export class StorageModule {}
