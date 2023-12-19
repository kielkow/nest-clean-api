import { Fail, Success } from '@/core/response-handling'

import { makeAnswer } from '@/test/factories/make-answer'
import { InMemoryAnswersRepository } from '@/test/repositories/in-memory-answers-repository'
import { InMemoryAnswersCommentsRepository } from '@/test/repositories/in-memory-answers-comments-repository'

import { CommentOnAnswerUseCase } from '.'

import { ResourceNotFoundError } from '@/core/errors'

describe('CommentOnAnswerUseCase', () => {
  let inMemoryAnswersCommentsRepository: InMemoryAnswersCommentsRepository,
    inMemoryAnswersRepository: InMemoryAnswersRepository

  let sut: CommentOnAnswerUseCase

  beforeEach(() => {
    inMemoryAnswersCommentsRepository = new InMemoryAnswersCommentsRepository()
    inMemoryAnswersRepository = new InMemoryAnswersRepository()

    sut = new CommentOnAnswerUseCase(
      inMemoryAnswersRepository,
      inMemoryAnswersCommentsRepository,
    )
  })

  it('should be able to create an answer comment', async () => {
    const answer = await inMemoryAnswersRepository.createAnswer(makeAnswer())

    const result = await sut.execute({
      answerId: answer.id,
      authorId: '1',
      content: 'This is the comment',
    })

    expect(Success.is(result)).toBe(true)
    expect(result).toBeInstanceOf(Success)
  })

  it('should not be able to create an answer comment if answer does not exists', async () => {
    const result = await sut.execute({
      answerId: '1',
      authorId: '1',
      content: 'This is the comment',
    })

    expect(Fail.is(result)).toBe(true)
    expect(result).toBeInstanceOf(Fail)
    expect(result).toEqual({ error: expect.any(ResourceNotFoundError) })
  })
})
