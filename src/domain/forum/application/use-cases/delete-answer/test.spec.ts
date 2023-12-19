import { Fail, Success } from '@/core/response-handling'

import { makeAnswer } from '@/test/factories/make-answer'
import { InMemoryAnswersRepository } from '@/test/repositories/in-memory-answers-repository'
import { InMemoryAnswerAttachmentsRepository } from '@/test/repositories/in-memory-answer-attachments-repository'

import { DeleteAnswerUseCase } from '.'

import { NotAllowedError, ResourceNotFoundError } from '@/core/errors'

describe('DeleteAnswerUseCase', () => {
  let inMemoryAnswersRepository: InMemoryAnswersRepository,
    inMemoryAnswerAttachmentsRepository: InMemoryAnswerAttachmentsRepository

  let sut: DeleteAnswerUseCase

  beforeEach(() => {
    inMemoryAnswerAttachmentsRepository =
      new InMemoryAnswerAttachmentsRepository()
    inMemoryAnswersRepository = new InMemoryAnswersRepository(
      inMemoryAnswerAttachmentsRepository,
    )

    sut = new DeleteAnswerUseCase(inMemoryAnswersRepository)
  })

  it('should be able to delete an answer', async () => {
    const answer = await inMemoryAnswersRepository.createAnswer(makeAnswer())

    const result = await sut.execute({
      id: answer.id,
      authorId: answer.authorId.id,
    })

    const answerExists = await inMemoryAnswersRepository.findById(answer.id)

    expect(answerExists).toBeUndefined()

    expect(Success.is(result)).toBe(true)
    expect(result).toBeInstanceOf(Success)
  })

  it('should not be able to delete an answer if does not exists', async () => {
    const result = await sut.execute({
      id: 'non-existing-answer-id',
      authorId: 'any-author-id',
    })

    expect(Fail.is(result)).toBe(true)
    expect(result).toBeInstanceOf(Fail)
    expect(result).toEqual({ error: expect.any(ResourceNotFoundError) })
  })

  it('should not be able to delete an answer if is not the author', async () => {
    const answer = await inMemoryAnswersRepository.createAnswer(makeAnswer())

    const result = await sut.execute({
      id: answer.id,
      authorId: 'non-author-id',
    })

    expect(Fail.is(result)).toBe(true)
    expect(result).toBeInstanceOf(Fail)
    expect(result).toEqual({ error: expect.any(NotAllowedError) })
  })
})
