import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'

import { envSchema } from './env'
import { AuthModule } from './auth/auth.module'
import { PrismaService } from './prisma/prisma.service'

import { AuthenticateController } from './controllers/authenticate.controller'
import { CreateAccoutController } from './controllers/create-account.controller'
import { CreateQuestionController } from './controllers/create-question.controller'

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validate: (env) => envSchema.parse(env),
    }),
    AuthModule,
  ],
  controllers: [
    AuthenticateController,
    CreateAccoutController,
    CreateQuestionController,
  ],
  providers: [PrismaService],
})
export class AppModule {}
