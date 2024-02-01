import { Module } from '@nestjs/common'

import { DatabaseModule } from '../database/database.module'
import { CryptographyModule } from '../cryptography/cryptography.module'

import { AuthenticateController } from './controllers/authenticate'
import { CreateAccoutController } from './controllers/create-account'
import { CreateQuestionController } from './controllers/create-question'
import { ListQuestionsController } from './controllers/list-questions'
import { FindQuestionBySlugController } from './controllers/get-question-by-slug'
import { EditQuestionController } from './controllers/edit-question'
import { DeleteQuestionController } from './controllers/delete-question'
import { AnswerQuestionController } from './controllers/answer-question'
import { DeleteAnswerController } from './controllers/delete-answer'
import { EditAnswerController } from './controllers/edit-answer'
import { ListQuestionAnswersController } from './controllers/list-question-answers'
import { ChooseQuestionBestAnswerController } from './controllers/choose-question-best-answer'
import { CommentOnQuestionController } from './controllers/comment-on-question'
import { DeleteQuestionCommentController } from './controllers/delete-question-comment'
import { DeleteAnswerCommentController } from './controllers/delete-answer-comment'

import { CreateQuestionUseCase } from '@/domain/forum/application/use-cases/create-question'
import { ListRecentQuestionsUseCase } from '@/domain/forum/application/use-cases/list-recent-questions'
import { AuthenticateStudentUseCase } from '@/domain/forum/application/use-cases/authenticate-student'
import { CreateStudentUseCase } from '@/domain/forum/application/use-cases/create-student'
import { FindQuestionBySlugUseCase } from '@/domain/forum/application/use-cases/find-question-by-slug'
import { EditQuestionUseCase } from '@/domain/forum/application/use-cases/edit-question'
import { DeleteQuestionUseCase } from '@/domain/forum/application/use-cases/delete-question'
import { AnswerQuestionUseCase } from '@/domain/forum/application/use-cases/answer-question'
import { DeleteAnswerUseCase } from '@/domain/forum/application/use-cases/delete-answer'
import { EditAnswerUseCase } from '@/domain/forum/application/use-cases/edit-answer'
import { ListQuestionAnswersUseCase } from '@/domain/forum/application/use-cases/list-question-answers'
import { ChooseQuestionBestAnswerUseCase } from '@/domain/forum/application/use-cases/choose-question-best-answer'
import { CommentOnQuestionUseCase } from '@/domain/forum/application/use-cases/comment-on-question'
import { DeleteQuestionCommentUseCase } from '@/domain/forum/application/use-cases/delete-question-comment'
import { DeleteAnswerCommentUseCase } from '@/domain/forum/application/use-cases/delete-answer-comment'

@Module({
  imports: [DatabaseModule, CryptographyModule],
  controllers: [
    AuthenticateController,
    CreateAccoutController,
    CreateQuestionController,
    ListQuestionsController,
    FindQuestionBySlugController,
    EditQuestionController,
    DeleteQuestionController,
    AnswerQuestionController,
    DeleteAnswerController,
    EditAnswerController,
    ListQuestionAnswersController,
    ChooseQuestionBestAnswerController,
    CommentOnQuestionController,
    DeleteQuestionCommentController,
    DeleteAnswerCommentController,
  ],
  providers: [
    CreateQuestionUseCase,
    ListRecentQuestionsUseCase,
    AuthenticateStudentUseCase,
    CreateStudentUseCase,
    FindQuestionBySlugUseCase,
    EditQuestionUseCase,
    DeleteQuestionUseCase,
    AnswerQuestionUseCase,
    DeleteAnswerUseCase,
    EditAnswerUseCase,
    ListQuestionAnswersUseCase,
    ChooseQuestionBestAnswerUseCase,
    CommentOnQuestionUseCase,
    DeleteQuestionCommentUseCase,
    DeleteAnswerCommentUseCase,
  ],
})
export class HttpModule {}
