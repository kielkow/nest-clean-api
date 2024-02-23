import { Module } from '@nestjs/common'

import { OnAnswerCreated } from '@/domain/notification/application/subscribers/on-answer-created'
import { OnQuestionBestAnswerCreated } from '@/domain/notification/application/subscribers/on-question-best-answer-created'
import { SendNotificationUseCase } from '@/domain/notification/application/use-cases/send-notification'

import { DatabaseModule } from '../database/database.module'

@Module({
  imports: [DatabaseModule],
  controllers: [],
  providers: [
    OnAnswerCreated,
    OnQuestionBestAnswerCreated,
    SendNotificationUseCase,
  ],
  exports: [],
})
export class EventsModule {}
