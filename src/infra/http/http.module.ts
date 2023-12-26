import { Module } from '@nestjs/common'

import { DatabaseModule } from '../database/database.module'

import { AuthenticateController } from './controllers/authenticate'
import { CreateAccoutController } from './controllers/create-account'
import { CreateQuestionController } from './controllers/create-question'
import { ListQuestionsController } from './controllers/list-questions'

import { CreateQuestionUseCase } from '@/domain/forum/application/use-cases/create-question'

@Module({
  imports: [DatabaseModule],
  controllers: [
    AuthenticateController,
    CreateAccoutController,
    CreateQuestionController,
    ListQuestionsController,
  ],
  providers: [CreateQuestionUseCase],
})
export class HttpModule {}
