import { Success } from '@/core/response-handling'

import { UniqueEntityID } from '@/core/entities/unique-entity-id'

import { makeAnswer } from '@/test/factories/make-answer'
import { InMemoryAnswersRepository } from '@/test/repositories/in-memory-answers-repository'

import { ListQuestionAnswersUseCase } from '.'

describe('ListQuestionAnswersUseCase', () => {
  let inMemoryAnswersRepository: InMemoryAnswersRepository
  let sut: ListQuestionAnswersUseCase

  beforeEach(() => {
    inMemoryAnswersRepository = new InMemoryAnswersRepository()
    sut = new ListQuestionAnswersUseCase(inMemoryAnswersRepository)
  })

  it('should be able to list question answers', async () => {
    const questionId = new UniqueEntityID()

    await inMemoryAnswersRepository.createAnswer(
      makeAnswer({
        questionId,
      }),
    )
    await inMemoryAnswersRepository.createAnswer(
      makeAnswer({
        questionId,
      }),
    )
    await inMemoryAnswersRepository.createAnswer(
      makeAnswer({
        questionId,
      }),
    )
    await inMemoryAnswersRepository.createAnswer(makeAnswer())

    const result = await sut.execute({
      questionId: questionId.id,
      paginationParams: {
        page: 1,
        perPage: 10,
      },
    })
    const answers = result.getValue()

    expect(Success.is(result)).toBe(true)
    expect(result).toBeInstanceOf(Success)

    expect(answers).toHaveLength(3)
  })

  it('should be able to list question answers by pagination', async () => {
    const questionId = new UniqueEntityID()

    await inMemoryAnswersRepository.createAnswer(
      makeAnswer({
        questionId,
      }),
    )
    await inMemoryAnswersRepository.createAnswer(
      makeAnswer({
        questionId,
      }),
    )
    await inMemoryAnswersRepository.createAnswer(
      makeAnswer({
        questionId,
      }),
    )
    await inMemoryAnswersRepository.createAnswer(
      makeAnswer({
        questionId,
      }),
    )

    const firstResult = await sut.execute({
      questionId: questionId.id,
      paginationParams: {
        page: 1,
        perPage: 2,
      },
    })
    const secondResult = await sut.execute({
      questionId: questionId.id,
      paginationParams: {
        page: 2,
        perPage: 2,
      },
    })

    const answersFirstPage = firstResult.getValue()
    const answersSecondPage = secondResult.getValue()

    expect(Success.is(firstResult)).toBe(true)
    expect(firstResult).toBeInstanceOf(Success)
    expect(Success.is(secondResult)).toBe(true)
    expect(secondResult).toBeInstanceOf(Success)

    expect(answersFirstPage).toHaveLength(2)
    expect(answersSecondPage).toHaveLength(2)
  })

  it('should not be able to list question answers if question does not exists', async () => {
    const result = await sut.execute({
      questionId: 'non-existing-question-id',
      paginationParams: {
        page: 1,
        perPage: 10,
      },
    })

    const answers = result.getValue()

    expect(Success.is(result)).toBe(true)
    expect(result).toBeInstanceOf(Success)
    expect(answers).toHaveLength(0)
  })
})
