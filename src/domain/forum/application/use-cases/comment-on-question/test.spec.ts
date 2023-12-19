import { Fail, Success } from '@/core/response-handling'

import { makeQuestion } from '@/test/factories/make-question'
import { InMemoryQuestionsRepository } from '@/test/repositories/in-memory-questions-repository'
import { InMemoryQuestionsCommentsRepository } from '@/test/repositories/in-memory-questions-comments-repository'

import { CommentOnQuestionUseCase } from '.'

import { ResourceNotFoundError } from '@/core/errors'

describe('CommentOnQuestionUseCase', () => {
  let inMemoryQuestionsCommentsRepository: InMemoryQuestionsCommentsRepository,
    inMemoryQuestionsRepository: InMemoryQuestionsRepository

  let sut: CommentOnQuestionUseCase

  beforeEach(() => {
    inMemoryQuestionsCommentsRepository =
      new InMemoryQuestionsCommentsRepository()
    inMemoryQuestionsRepository = new InMemoryQuestionsRepository()

    sut = new CommentOnQuestionUseCase(
      inMemoryQuestionsRepository,
      inMemoryQuestionsCommentsRepository,
    )
  })

  it('should be able to create an question comment', async () => {
    const question = await inMemoryQuestionsRepository.createQuestion(
      makeQuestion(),
    )

    const result = await sut.execute({
      questionId: question.id,
      authorId: '1',
      content: 'This is the comment',
    })

    expect(Success.is(result)).toBe(true)
    expect(result).toBeInstanceOf(Success)
  })

  it('should not be able to create an question comment if question does not exists', async () => {
    const result = await sut.execute({
      questionId: '1',
      authorId: '1',
      content: 'This is the comment',
    })

    expect(Fail.is(result)).toBe(true)
    expect(result).toBeInstanceOf(Fail)
    expect(result).toEqual({ error: expect.any(ResourceNotFoundError) })
  })
})
