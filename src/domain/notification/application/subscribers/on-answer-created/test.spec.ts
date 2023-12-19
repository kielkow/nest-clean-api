import { SpyInstance } from 'vitest'

import { UniqueEntityID } from '@/core/entities/unique-entity-id'

import { waitFor } from '@/test/utils/wait-for'

import { makeAnswer } from '@/test/factories/make-answer'
import { makeQuestion } from '@/test/factories/make-question'

import { InMemoryAnswersRepository } from '@/test/repositories/in-memory-answers-repository'
import { InMemoryQuestionsRepository } from '@/test/repositories/in-memory-questions-repository'
import { InMemoryNotificationsRepository } from '@/test/repositories/in-memory-notifications-repository'

import {
  Input as SendNotificationRequest,
  Output as SendNotificationResponse,
  SendNotificationUseCase,
} from '../../use-cases/send-notification'

import { OnAnswerCreated } from '.'

describe('OnAnswerCreated', () => {
  let inMemoryAnswersRepository: InMemoryAnswersRepository,
    inMemoryQuestionsRepository: InMemoryQuestionsRepository,
    inMemoryNotificationsRepository: InMemoryNotificationsRepository

  let sendNotificationUseCase: SendNotificationUseCase

  let sut: OnAnswerCreated

  let spyNewAnswerNotification: SpyInstance<
    [SendNotificationRequest],
    Promise<SendNotificationResponse>
  >

  beforeEach(() => {
    inMemoryAnswersRepository = new InMemoryAnswersRepository()
    inMemoryQuestionsRepository = new InMemoryQuestionsRepository()
    inMemoryNotificationsRepository = new InMemoryNotificationsRepository()

    sendNotificationUseCase = new SendNotificationUseCase(
      inMemoryNotificationsRepository,
    )

    spyNewAnswerNotification = vi.spyOn(sendNotificationUseCase, 'execute')

    sut = new OnAnswerCreated(
      inMemoryQuestionsRepository,
      sendNotificationUseCase,
    )

    console.info('Subscriber Created:', sut.constructor.name)
  })

  it('should be able send notification when answer is created', async () => {
    const question = makeQuestion()
    const answer = makeAnswer({ questionId: new UniqueEntityID(question.id) })

    await inMemoryQuestionsRepository.createQuestion(question)
    await inMemoryAnswersRepository.createAnswer(answer)

    await waitFor(() => {
      expect(spyNewAnswerNotification).toHaveBeenCalled()
    }, 5000)
  })
})
