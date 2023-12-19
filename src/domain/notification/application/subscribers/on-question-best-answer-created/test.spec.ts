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

import { OnQuestionBestAnswerCreated } from '.'

describe('OnQuestionBestAnswerCreated', () => {
  let inMemoryAnswersRepository: InMemoryAnswersRepository,
    inMemoryQuestionsRepository: InMemoryQuestionsRepository,
    inMemoryNotificationsRepository: InMemoryNotificationsRepository

  let sendNotificationUseCase: SendNotificationUseCase

  let sut: OnQuestionBestAnswerCreated

  let spyQuestionBestAnswerNotification: SpyInstance<
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

    spyQuestionBestAnswerNotification = vi.spyOn(
      sendNotificationUseCase,
      'execute',
    )

    sut = new OnQuestionBestAnswerCreated(
      inMemoryAnswersRepository,
      sendNotificationUseCase,
    )

    console.info('Subscriber Created:', sut.constructor.name)
  })

  it('should be able send notification when best answer is created', async () => {
    const question = makeQuestion()
    const answer = makeAnswer({ questionId: new UniqueEntityID(question.id) })

    await inMemoryQuestionsRepository.createQuestion(question)
    await inMemoryAnswersRepository.createAnswer(answer)

    question.bestAnswerId = new UniqueEntityID(answer.id)

    await inMemoryQuestionsRepository.editQuestion(question)

    await waitFor(() => {
      expect(spyQuestionBestAnswerNotification).toHaveBeenCalled()
    }, 5000)
  })
})
