import { Success } from '@/core/response-handling'

import { InMemoryQuestionsRepository } from '@/test/repositories/in-memory-questions-repository'

import { CreateQuestionUseCase } from '.'

describe('CreateQuestionUseCase', () => {
  let inMemoryQuestionsRepository: InMemoryQuestionsRepository
  let sut: CreateQuestionUseCase

  beforeEach(() => {
    inMemoryQuestionsRepository = new InMemoryQuestionsRepository()
    sut = new CreateQuestionUseCase(inMemoryQuestionsRepository)
  })

  it('should be able to create an question', async () => {
    const result = await sut.execute({
      title: 'This is the title',
      content: 'This is the question',
      authorId: '1',
    })

    expect(Success.is(result)).toBe(true)
    expect(result).toBeInstanceOf(Success)
  })

  it('should be able to create an question with attachments', async () => {
    const result = await sut.execute({
      title: 'This is the title',
      content: 'This is the question',
      authorId: '1',
      attachmentsIds: ['1', '2', '3'],
    })

    const question = result.getValue()

    expect(Success.is(result)).toBe(true)
    expect(result).toBeInstanceOf(Success)

    expect(question).toHaveProperty('attachments')
    expect(question?.attachments.getItems()).toHaveLength(3)
  })
})
