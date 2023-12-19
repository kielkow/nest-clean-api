import { DomainEvents } from '@/core/events/domain-events'
import { EventHandler } from '@/core/events/event-handler'

import { AnswersRepository } from '@/domain/forum/application/repositories/answers-repository'

import { SendNotificationUseCase } from '../../use-cases/send-notification'
import { QuestionBestAnswerEvent } from '@/domain/forum/enterprise/events/question-best-answer-event'

export class OnQuestionBestAnswerCreated implements EventHandler {
  constructor(
    private answersRepository: AnswersRepository,
    private sendNotificationUseCase: SendNotificationUseCase,
  ) {
    this.setupSubscriptions()
  }

  setupSubscriptions(): void {
    DomainEvents.registerSubscriber(
      this.sendQuestionBestAnswerNotification.bind(this),
      QuestionBestAnswerEvent.name,
    )
  }

  private async sendQuestionBestAnswerNotification(
    event: QuestionBestAnswerEvent,
  ): Promise<void> {
    const { question, bestAnswerId } = event

    const answer = await this.answersRepository.findById(bestAnswerId.id)

    if (answer) {
      await this.sendNotificationUseCase.execute({
        recipientId: question.authorId,
        title: 'Best Answer',
        content: `Your question "${question.title}" has a new best answer.`,
      })
    }
  }
}
