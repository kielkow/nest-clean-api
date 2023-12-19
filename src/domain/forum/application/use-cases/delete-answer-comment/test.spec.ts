import { Fail } from '@/core/response-handling'
import { makeAnswerComment } from '@/test/factories/make-answer-comment'
import { InMemoryAnswersCommentsRepository } from '@/test/repositories/in-memory-answers-comments-repository'

import { DeleteAnswerCommentUseCase } from '.'

import { NotAllowedError, ResourceNotFoundError } from '@/core/errors'

describe('DeleteAnswerCommentByIdUseCase', () => {
  let inMemoryAnswersRepository: InMemoryAnswersCommentsRepository
  let sut: DeleteAnswerCommentUseCase

  beforeEach(() => {
    inMemoryAnswersRepository = new InMemoryAnswersCommentsRepository()
    sut = new DeleteAnswerCommentUseCase(inMemoryAnswersRepository)
  })

  it('should be able to delete answer comment by ID', async () => {
    const comment = makeAnswerComment()

    await inMemoryAnswersRepository.create(comment)

    await sut.execute({
      id: comment.id,
      authorId: comment.authorId.id,
    })

    const answerComment = await inMemoryAnswersRepository.findById(comment.id)

    expect(answerComment).toBeUndefined()
  })

  it('should not be able to delete answer comment by ID if it does not exist', async () => {
    const result = await sut.execute({
      id: 'invalid_id',
      authorId: 'any_author_id',
    })

    expect(Fail.is(result)).toBe(true)
    expect(result).toBeInstanceOf(Fail)
    expect(result).toEqual({ error: expect.any(ResourceNotFoundError) })
  })

  it('should not be able to delete answer comment by ID if user is not the author', async () => {
    const comment = makeAnswerComment()

    await inMemoryAnswersRepository.create(comment)

    const result = await sut.execute({
      id: comment.id,
      authorId: 'invalid_author_id',
    })

    expect(Fail.is(result)).toBe(true)
    expect(result).toBeInstanceOf(Fail)
    expect(result).toEqual({ error: expect.any(NotAllowedError) })
  })
})
