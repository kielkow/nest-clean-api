import { Success } from '@/core/response-handling'

import { InMemoryAnswersRepository } from '@/test/repositories/in-memory-answers-repository'
import { InMemoryAnswerAttachmentsRepository } from '@/test/repositories/in-memory-answer-attachments-repository'

import { AnswerQuestionUseCase } from '.'

describe('AnswerQuestionUseCase', () => {
  let inMemoryAnswerAttachmentsRepository: InMemoryAnswerAttachmentsRepository
  let inMemoryAnswersRepository: InMemoryAnswersRepository
  let sut: AnswerQuestionUseCase

  beforeEach(() => {
    inMemoryAnswerAttachmentsRepository =
      new InMemoryAnswerAttachmentsRepository()

    inMemoryAnswersRepository = new InMemoryAnswersRepository(
      inMemoryAnswerAttachmentsRepository,
    )

    sut = new AnswerQuestionUseCase(inMemoryAnswersRepository)
  })

  it('should be able to create an answer', async () => {
    const result = await sut.execute({
      authorId: '1',
      questionId: '1',
      content: 'This is the answer',
    })

    expect(Success.is(result)).toBeTruthy()
  })

  it('should be able to create an answer with attachments', async () => {
    const result = await sut.execute({
      authorId: '1',
      questionId: '1',
      content: 'This is the answer',
      attachmentsIds: ['1', '2', '3'],
    })

    const answer = result.getValue()

    expect(Success.is(result)).toBe(true)
    expect(result).toBeInstanceOf(Success)

    expect(answer).toHaveProperty('attachments')
    expect(answer?.attachments.getItems()).toHaveLength(3)
  })

  it('should persist attachments when a new answer was created', async () => {
    const result = await sut.execute({
      authorId: '1',
      questionId: '1',
      content: 'This is the answer',
      attachmentsIds: ['1', '2', '3'],
    })

    expect(Success.is(result)).toBe(true)
    expect(result).toBeInstanceOf(Success)
    expect(inMemoryAnswerAttachmentsRepository.answerAttachments).toHaveLength(
      3,
    )
  })
})
