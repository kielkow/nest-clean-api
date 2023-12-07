import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'

import { envSchema } from './env'
import { AuthModule } from './auth/auth.module'
import { PrismaService } from './prisma/prisma.service'

import { CreateAccoutController } from './controllers/create-account.controller'

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validate: (env) => envSchema.parse(env),
    }),
    AuthModule,
  ],
  controllers: [CreateAccoutController],
  providers: [PrismaService],
})
export class AppModule {}
