import { Fail, Success } from '@/core/response-handling'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'

import { makeQuestion } from '@/test/factories/make-question'
import { makeQuestionComment } from '@/test/factories/make-question-comment'
import { InMemoryQuestionsRepository } from '@/test/repositories/in-memory-questions-repository'
import { InMemoryQuestionsCommentsRepository } from '@/test/repositories/in-memory-questions-comments-repository'

import { ResourceNotFoundError } from '@/core/errors'

import { ListQuestionCommentsUseCase } from '.'

describe('CommentOnQuestionUseCase', () => {
  let inMemoryQuestionsCommentsRepository: InMemoryQuestionsCommentsRepository,
    inMemoryQuestionsRepository: InMemoryQuestionsRepository

  let sut: ListQuestionCommentsUseCase

  beforeEach(() => {
    inMemoryQuestionsCommentsRepository =
      new InMemoryQuestionsCommentsRepository()
    inMemoryQuestionsRepository = new InMemoryQuestionsRepository()

    sut = new ListQuestionCommentsUseCase(
      inMemoryQuestionsRepository,
      inMemoryQuestionsCommentsRepository,
    )
  })

  it('should be able to list comments from question', async () => {
    const question = await inMemoryQuestionsRepository.createQuestion(
      makeQuestion(),
    )

    await inMemoryQuestionsCommentsRepository.create(
      makeQuestionComment({
        questionId: new UniqueEntityID(question.id),
      }),
    )

    const result = await sut.execute({
      questionId: question.id,
      paginationParams: {
        page: 1,
        perPage: 10,
      },
    })
    const questionComments = result.getValue()

    expect(Success.is(result)).toBe(true)
    expect(result).toBeInstanceOf(Success)
    expect(questionComments).toEqual([
      {
        _uniqueEnityId: {
          _id: expect.any(String),
        },
        _props: {
          authorId: {
            _id: expect.any(String),
          },
          content: expect.any(String),
          questionId: {
            _id: question.id,
          },
        },
        _createdAt: expect.any(Date),
        _updatedAt: undefined,
      },
    ])
  })

  it('should not be able to list comments from question if question does not exists', async () => {
    const result = await sut.execute({
      questionId: 'non-existing-question-id',
      paginationParams: {
        page: 1,
        perPage: 10,
      },
    })

    expect(Fail.is(result)).toBe(true)
    expect(result).toBeInstanceOf(Fail)
    expect(result).toEqual({ error: expect.any(ResourceNotFoundError) })
  })

  it('should be able to list comments from question with pagination', async () => {
    const question = await inMemoryQuestionsRepository.createQuestion(
      makeQuestion(),
    )

    const firstComment = await inMemoryQuestionsCommentsRepository.create(
      makeQuestionComment({
        questionId: new UniqueEntityID(question.id),
      }),
    )
    const secondComment = await inMemoryQuestionsCommentsRepository.create(
      makeQuestionComment({
        questionId: new UniqueEntityID(question.id),
      }),
    )

    const firstResult = await sut.execute({
      questionId: question.id,
      paginationParams: {
        page: 1,
        perPage: 1,
      },
    })
    const secondResult = await sut.execute({
      questionId: question.id,
      paginationParams: {
        page: 2,
        perPage: 1,
      },
    })

    const firstPageQuestionComments = firstResult.getValue()
    const secondPageQuestionComments = secondResult.getValue()

    expect(Success.is(firstResult)).toBe(true)
    expect(firstResult).toBeInstanceOf(Success)
    expect(Success.is(secondResult)).toBe(true)
    expect(secondResult).toBeInstanceOf(Success)

    expect(firstPageQuestionComments).toEqual([
      {
        _uniqueEnityId: {
          _id: firstComment.id,
        },
        _props: {
          authorId: {
            _id: expect.any(String),
          },
          content: expect.any(String),
          questionId: {
            _id: question.id,
          },
        },
        _createdAt: expect.any(Date),
        _updatedAt: undefined,
      },
    ])
    expect(secondPageQuestionComments).toEqual([
      {
        _uniqueEnityId: {
          _id: secondComment.id,
        },
        _props: {
          authorId: {
            _id: expect.any(String),
          },
          content: expect.any(String),
          questionId: {
            _id: question.id,
          },
        },
        _createdAt: expect.any(Date),
        _updatedAt: undefined,
      },
    ])
  })
})
