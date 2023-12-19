import { Fail, Success } from '@/core/response-handling'

import { makeAnswer } from '@/test/factories/make-answer'
import { InMemoryAnswersRepository } from '@/test/repositories/in-memory-answers-repository'
import { InMemoryAnswersCommentsRepository } from '@/test/repositories/in-memory-answers-comments-repository'

import { ListAnswerCommentsUseCase } from '.'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { makeAnswerComment } from '@/test/factories/make-answer-comment'

import { ResourceNotFoundError } from '@/core/errors'

describe('CommentOnAnswerUseCase', () => {
  let inMemoryAnswersCommentsRepository: InMemoryAnswersCommentsRepository,
    inMemoryAnswersRepository: InMemoryAnswersRepository

  let sut: ListAnswerCommentsUseCase

  beforeEach(() => {
    inMemoryAnswersCommentsRepository = new InMemoryAnswersCommentsRepository()
    inMemoryAnswersRepository = new InMemoryAnswersRepository()

    sut = new ListAnswerCommentsUseCase(
      inMemoryAnswersRepository,
      inMemoryAnswersCommentsRepository,
    )
  })

  it('should be able to list comments from answer', async () => {
    const answer = await inMemoryAnswersRepository.createAnswer(makeAnswer())

    await inMemoryAnswersCommentsRepository.create(
      makeAnswerComment({
        answerId: new UniqueEntityID(answer.id),
      }),
    )

    const result = await sut.execute({
      answerId: answer.id,
      paginationParams: {
        page: 1,
        perPage: 10,
      },
    })

    const answerComments = result.getValue()

    expect(Success.is(result)).toBe(true)
    expect(result).toBeInstanceOf(Success)

    expect(answerComments).toEqual([
      {
        _uniqueEnityId: {
          _id: expect.any(String),
        },
        _props: {
          authorId: {
            _id: expect.any(String),
          },
          content: expect.any(String),
          answerId: {
            _id: answer.id,
          },
        },
        _createdAt: expect.any(Date),
        _updatedAt: undefined,
      },
    ])
  })

  it('should not be able to list comments from answer if answer does not exists', async () => {
    const result = await sut.execute({
      answerId: 'non-existing-answer-id',
      paginationParams: {
        page: 1,
        perPage: 10,
      },
    })

    expect(Fail.is(result)).toBe(true)
    expect(result).toBeInstanceOf(Fail)
    expect(result).toEqual({ error: expect.any(ResourceNotFoundError) })
  })

  it('should be able to list comments from answer with pagination', async () => {
    const answer = await inMemoryAnswersRepository.createAnswer(makeAnswer())

    const firstComment = await inMemoryAnswersCommentsRepository.create(
      makeAnswerComment({
        answerId: new UniqueEntityID(answer.id),
      }),
    )
    const secondComment = await inMemoryAnswersCommentsRepository.create(
      makeAnswerComment({
        answerId: new UniqueEntityID(answer.id),
      }),
    )

    const firstResult = await sut.execute({
      answerId: answer.id,
      paginationParams: {
        page: 1,
        perPage: 1,
      },
    })
    const secondResult = await sut.execute({
      answerId: answer.id,
      paginationParams: {
        page: 2,
        perPage: 1,
      },
    })

    const firstPageAnswerComments = firstResult.getValue()
    const secondPageAnswerComments = secondResult.getValue()

    expect(Success.is(firstResult)).toBe(true)
    expect(firstResult).toBeInstanceOf(Success)
    expect(Success.is(secondResult)).toBe(true)
    expect(secondResult).toBeInstanceOf(Success)

    expect(firstPageAnswerComments).toEqual([
      {
        _uniqueEnityId: {
          _id: firstComment.id,
        },
        _props: {
          authorId: {
            _id: expect.any(String),
          },
          content: expect.any(String),
          answerId: {
            _id: answer.id,
          },
        },
        _createdAt: expect.any(Date),
        _updatedAt: undefined,
      },
    ])
    expect(secondPageAnswerComments).toEqual([
      {
        _uniqueEnityId: {
          _id: secondComment.id,
        },
        _props: {
          authorId: {
            _id: expect.any(String),
          },
          content: expect.any(String),
          answerId: {
            _id: answer.id,
          },
        },
        _createdAt: expect.any(Date),
        _updatedAt: undefined,
      },
    ])
  })
})
