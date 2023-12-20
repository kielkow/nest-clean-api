import { Module } from '@nestjs/common'

import { PrismaService } from '../prisma/prisma.service'

import { AuthenticateController } from './controllers/authenticate'
import { CreateAccoutController } from './controllers/create-account'
import { CreateQuestionController } from './controllers/create-question'
import { ListQuestionsController } from './controllers/list-questions'

@Module({
  controllers: [
    AuthenticateController,
    CreateAccoutController,
    CreateQuestionController,
    ListQuestionsController,
  ],
  providers: [PrismaService],
})
export class HttpModule {}
