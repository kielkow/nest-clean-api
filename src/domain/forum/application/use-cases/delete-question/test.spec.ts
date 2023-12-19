import { Success, Fail } from '@/core/response-handling'

import { makeQuestion } from '@/test/factories/make-question'
import { InMemoryQuestionsRepository } from '@/test/repositories/in-memory-questions-repository'
import { InMemoryQuestionAttachmentsRepository } from '@/test/repositories/in-memory-question-attachments-repository'

import { NotAllowedError, ResourceNotFoundError } from '@/core/errors'

import { DeleteQuestionUseCase } from '.'

describe('DeleteQuestionUseCase', () => {
  let inMemoryQuestionsRepository: InMemoryQuestionsRepository,
    inMemoryQuestionAttachmentsRepository: InMemoryQuestionAttachmentsRepository

  let sut: DeleteQuestionUseCase

  beforeEach(() => {
    inMemoryQuestionAttachmentsRepository =
      new InMemoryQuestionAttachmentsRepository()
    inMemoryQuestionsRepository = new InMemoryQuestionsRepository(
      inMemoryQuestionAttachmentsRepository,
    )

    sut = new DeleteQuestionUseCase(inMemoryQuestionsRepository)
  })

  it('should be able to delete an question', async () => {
    const question = await inMemoryQuestionsRepository.createQuestion(
      makeQuestion(),
    )

    const result = await sut.execute({
      id: question.id,
      authorId: question.authorId.id,
    })

    const questionExists = await inMemoryQuestionsRepository.findById(
      question.id,
    )

    expect(questionExists).toBeUndefined()
    expect(Success.is(result)).toBe(true)
  })

  it('should not be able to delete an question if is not the author', async () => {
    const question = await inMemoryQuestionsRepository.createQuestion(
      makeQuestion(),
    )

    const result = await sut.execute({
      id: question.id,
      authorId: 'non-author-id',
    })

    expect(Fail.is(result)).toBe(true)
    expect(result).toBeInstanceOf(Fail)
    expect(result).toEqual({ error: expect.any(NotAllowedError) })
  })

  it('should not be able to delete an question if does not exists', async () => {
    const result = await sut.execute({
      id: 'non-existing-question-id',
      authorId: 'any-author-id',
    })

    expect(Fail.is(result)).toBe(true)
    expect(result).toBeInstanceOf(Fail)
    expect(result).toEqual({ error: expect.any(ResourceNotFoundError) })
  })
})
