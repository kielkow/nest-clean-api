import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'

import { envSchema } from './env'
import { AuthModule } from './auth/auth.module'
import { PrismaService } from './prisma/prisma.service'

import { AuthenticateController } from './controllers/authenticate'
import { CreateAccoutController } from './controllers/create-account'
import { CreateQuestionController } from './controllers/create-question'
import { ListQuestionsController } from './controllers/list-questions'

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
    ListQuestionsController,
  ],
  providers: [PrismaService],
})
export class AppModule {}
