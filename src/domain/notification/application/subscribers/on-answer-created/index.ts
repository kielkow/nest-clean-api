import { Injectable } from '@nestjs/common'

import { DomainEvents } from '@/core/events/domain-events'
import { EventHandler } from '@/core/events/event-handler'

import { AnswerCreatedEvent } from '@/domain/forum/enterprise/events/answer-created-event'
import { QuestionsRepository } from '@/domain/forum/application/repositories/questions-repository'

import { SendNotificationUseCase } from '../../use-cases/send-notification'

@Injectable()
export class OnAnswerCreated implements EventHandler {
  constructor(
    private questionsRepository: QuestionsRepository,
    private sendNotificationUseCase: SendNotificationUseCase,
  ) {
    this.setupSubscriptions()
  }

  setupSubscriptions(): void {
    DomainEvents.registerSubscriber(
      this.sendNewAnswerNotification.bind(this),
      AnswerCreatedEvent.name,
    )
  }

  private async sendNewAnswerNotification(
    event: AnswerCreatedEvent,
  ): Promise<void> {
    const { answer } = event

    const question = await this.questionsRepository.findById(
      answer.questionId.id,
    )

    if (question) {
      await this.sendNotificationUseCase.execute({
        recipientId: question.authorId,
        title: 'New Answer',
        content: `Your question "${question.title}" has a new answer.`,
      })
    }
  }
}
