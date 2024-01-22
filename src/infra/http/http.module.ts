import { Module } from '@nestjs/common'

import { DatabaseModule } from '../database/database.module'
import { CryptographyModule } from '../cryptography/cryptography.module'

import { AuthenticateController } from './controllers/authenticate'
import { CreateAccoutController } from './controllers/create-account'
import { CreateQuestionController } from './controllers/create-question'
import { ListQuestionsController } from './controllers/list-questions'
import { FindQuestionBySlugController } from './controllers/get-question-by-slug'
import { EditQuestionController } from './controllers/edit-question'

import { CreateQuestionUseCase } from '@/domain/forum/application/use-cases/create-question'
import { ListRecentQuestionsUseCase } from '@/domain/forum/application/use-cases/list-recent-questions'
import { AuthenticateStudentUseCase } from '@/domain/forum/application/use-cases/authenticate-student'
import { CreateStudentUseCase } from '@/domain/forum/application/use-cases/create-student'
import { FindQuestionBySlugUseCase } from '@/domain/forum/application/use-cases/find-question-by-slug'
import { EditQuestionUseCase } from '@/domain/forum/application/use-cases/edit-question'

@Module({
  imports: [DatabaseModule, CryptographyModule],
  controllers: [
    AuthenticateController,
    CreateAccoutController,
    CreateQuestionController,
    ListQuestionsController,
    FindQuestionBySlugController,
    EditQuestionController,
  ],
  providers: [
    CreateQuestionUseCase,
    ListRecentQuestionsUseCase,
    AuthenticateStudentUseCase,
    CreateStudentUseCase,
    FindQuestionBySlugUseCase,
    EditQuestionUseCase,
  ],
})
export class HttpModule {}
