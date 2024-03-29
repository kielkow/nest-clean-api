import { Module } from '@nestjs/common'

import { PrismaService } from './prisma/prisma.service'

import { CacheModule } from '../cache/cache.module'

import { QuestionsRepository } from '@/domain/forum/application/repositories/questions-repository'
import { StudentsRepository } from '@/domain/forum/application/repositories/students-repository'
import { QuestionAttachmentsRepository } from '@/domain/forum/application/repositories/question-attachments-repository'
import { AnswersRepository } from '@/domain/forum/application/repositories/answers-repository'
import { QuestionsCommentsRepository } from '@/domain/forum/application/repositories/questions-comments-repository'
import { AnswersCommentsRepository } from '@/domain/forum/application/repositories/answers-comments-repository'
import { AnswerAttachmentsRepository } from '@/domain/forum/application/repositories/answer-attachments-repository'
import { AttachmentsRepository } from '@/domain/forum/application/repositories/attachments-repository'
import { NotificationsRepository } from '@/domain/notification/application/repositories/notifications-repository'

import { PrismaQuestionsRepository } from './prisma/repositories/prisma-questions-repository'
import { PrismaAnswersRepository } from './prisma/repositories/prisma-answers-repository'
import { PrismaQuestionCommentsRepository } from './prisma/repositories/prisma-question-comments-repository'
import { PrismaAnswerCommentsRepository } from './prisma/repositories/prisma-answer-comments-repository'
import { PrismaQuestionAttachmentsRepository } from './prisma/repositories/prisma-question-attachments-repository'
import { PrismaAnswerAttachmentsRepository } from './prisma/repositories/prisma-answer-attachments-repository'
import { PrismaStudentsRepository } from './prisma/repositories/prisma-students-repository'
import { PrismaAttachmentsRepository } from './prisma/repositories/prisma-attachments-repository'
import { PrismaNotificationRepository } from './prisma/repositories/prisma-notification-repository'

@Module({
  imports: [CacheModule],
  providers: [
    PrismaService,
    {
      provide: QuestionsRepository,
      useClass: PrismaQuestionsRepository,
    },
    {
      provide: StudentsRepository,
      useClass: PrismaStudentsRepository,
    },
    {
      provide: QuestionAttachmentsRepository,
      useClass: PrismaQuestionAttachmentsRepository,
    },
    {
      provide: AnswersRepository,
      useClass: PrismaAnswersRepository,
    },
    {
      provide: QuestionsCommentsRepository,
      useClass: PrismaQuestionCommentsRepository,
    },
    {
      provide: AnswersCommentsRepository,
      useClass: PrismaAnswerCommentsRepository,
    },
    {
      provide: AnswerAttachmentsRepository,
      useClass: PrismaAnswerAttachmentsRepository,
    },
    {
      provide: AttachmentsRepository,
      useClass: PrismaAttachmentsRepository,
    },
    {
      provide: NotificationsRepository,
      useClass: PrismaNotificationRepository,
    },
  ],
  exports: [
    PrismaService,
    QuestionsRepository,
    StudentsRepository,
    AnswersRepository,
    QuestionsCommentsRepository,
    AnswersCommentsRepository,
    QuestionAttachmentsRepository,
    AnswerAttachmentsRepository,
    AttachmentsRepository,
    NotificationsRepository,
  ],
})
export class DatabaseModule {}
