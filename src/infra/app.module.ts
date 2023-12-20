import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'

import { envSchema } from './env'

import { AuthModule } from './auth/auth.module'
import { HttpModule } from './http/http.module'

import { PrismaService } from './prisma/prisma.service'

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validate: (env) => envSchema.parse(env),
    }),
    AuthModule,
    HttpModule,
  ],
  providers: [PrismaService],
})
export class AppModule {}
