import { Success, Fail } from '@/core/response-handling'

import { makeQuestionComment } from '@/test/factories/make-question-comment'
import { InMemoryQuestionsCommentsRepository } from '@/test/repositories/in-memory-questions-comments-repository'

import { DeleteQuestionCommentUseCase } from '.'

import { ResourceNotFoundError, NotAllowedError } from '@/core/errors'

describe('DeleteQuestionCommentByIdUseCase', () => {
  let inMemoryQuestionsRepository: InMemoryQuestionsCommentsRepository
  let sut: DeleteQuestionCommentUseCase

  beforeEach(() => {
    inMemoryQuestionsRepository = new InMemoryQuestionsCommentsRepository()
    sut = new DeleteQuestionCommentUseCase(inMemoryQuestionsRepository)
  })

  it('should be able to delete question comment by ID', async () => {
    const comment = makeQuestionComment()

    await inMemoryQuestionsRepository.create(comment)

    const result = await sut.execute({
      id: comment.id,
      authorId: comment.authorId.id,
    })

    const questionComment = await inMemoryQuestionsRepository.findById(
      comment.id,
    )

    expect(questionComment).toBeUndefined()

    expect(Success.is(result)).toBe(true)
    expect(result).toBeInstanceOf(Success)
  })

  it('should not be able to delete question comment by ID if it does not exist', async () => {
    const result = await sut.execute({
      id: 'invalid_id',
      authorId: 'any_author_id',
    })

    expect(Fail.is(result)).toBe(true)
    expect(result).toBeInstanceOf(Fail)
    expect(result).toEqual({ error: expect.any(ResourceNotFoundError) })
  })

  it('should not be able to delete question comment by ID if user is not the author', async () => {
    const comment = makeQuestionComment()

    await inMemoryQuestionsRepository.create(comment)

    const result = await sut.execute({
      id: comment.id,
      authorId: 'invalid_author_id',
    })

    expect(Fail.is(result)).toBe(true)
    expect(result).toBeInstanceOf(Fail)
    expect(result).toEqual({ error: expect.any(NotAllowedError) })
  })
})
