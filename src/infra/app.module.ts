import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'

import { envSchema } from './env'

import { AuthModule } from './auth/auth.module'
import { HttpModule } from './http/http.module'
import { DatabaseModule } from './database/database.module'
import { EnvHelperService } from './env-helper/env-helper.service'

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validate: (env) => envSchema.parse(env),
    }),
    AuthModule,
    HttpModule,
    DatabaseModule,
  ],
  providers: [EnvHelperService],
})
export class AppModule {}
