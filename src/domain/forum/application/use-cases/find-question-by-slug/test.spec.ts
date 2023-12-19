import { Fail, Success } from '@/core/response-handling'

import { makeQuestion } from '@/test/factories/make-question'
import { InMemoryQuestionsRepository } from '@/test/repositories/in-memory-questions-repository'

import { FindQuestionBySlugUseCase } from '.'

import { ResourceNotFoundError } from '@/core/errors'

describe('FindQuestionBySlugUseCase', () => {
  let inMemoryQuestionsRepository: InMemoryQuestionsRepository
  let sut: FindQuestionBySlugUseCase

  beforeEach(() => {
    inMemoryQuestionsRepository = new InMemoryQuestionsRepository()
    sut = new FindQuestionBySlugUseCase(inMemoryQuestionsRepository)
  })

  it('should be able to find question by slug', async () => {
    const payloadQuestion = makeQuestion({
      title: 'This is the title',
    })

    await inMemoryQuestionsRepository.createQuestion(payloadQuestion)

    const result = await sut.execute({ slug: 'this-is-the-title' })
    const question = result.getValue()

    expect(Success.is(result)).toBe(true)
    expect(result).toBeInstanceOf(Success)

    expect(question).toHaveProperty('_props.slug.value', 'this-is-the-title')
  })

  it('should not be able to find question by slug if does not exists', async () => {
    const result = await sut.execute({ slug: 'this-is-the-title' })

    expect(Fail.is(result)).toBe(true)
    expect(result).toBeInstanceOf(Fail)
    expect(result).toEqual({ error: expect.any(ResourceNotFoundError) })
  })
})
