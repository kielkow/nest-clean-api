import { ResourceNotFoundError } from '@/core/errors'
import { Fail, Success } from '@/core/response-handling'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'

import { makeAnswer } from '@/test/factories/make-answer'
import { makeStudent } from '@/test/factories/make-student'
import { makeAnswerComment } from '@/test/factories/make-answer-comment'

import { InMemoryAnswersRepository } from '@/test/repositories/in-memory-answers-repository'
import { InMemoryStudentsRepository } from '@/test/repositories/in-memory-students-repository'
import { InMemoryAnswersCommentsRepository } from '@/test/repositories/in-memory-answers-comments-repository'

import { ListAnswerCommentsUseCase } from '.'

describe('CommentOnAnswerUseCase', () => {
  let inMemoryAnswersCommentsRepository: InMemoryAnswersCommentsRepository,
    inMemoryAnswersRepository: InMemoryAnswersRepository,
    inMemoryStudentsRepository: InMemoryStudentsRepository

  let sut: ListAnswerCommentsUseCase

  beforeEach(() => {
    inMemoryStudentsRepository = new InMemoryStudentsRepository()

    inMemoryAnswersCommentsRepository = new InMemoryAnswersCommentsRepository(
      inMemoryStudentsRepository,
    )

    inMemoryAnswersRepository = new InMemoryAnswersRepository()

    sut = new ListAnswerCommentsUseCase(
      inMemoryAnswersRepository,
      inMemoryAnswersCommentsRepository,
    )
  })

  it('should be able to list comments from answer', async () => {
    const student = makeStudent({
      name: 'John Doe',
      email: 'jonhdoe@email.com',
      password: 'password',
    })

    await inMemoryStudentsRepository.createStudent(student)

    const answer = await inMemoryAnswersRepository.createAnswer(
      makeAnswer({
        authorId: new UniqueEntityID(student.id),
      }),
    )

    await inMemoryAnswersCommentsRepository.create(
      makeAnswerComment({
        authorId: new UniqueEntityID(student.id),
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
    expect(answerComments).toHaveLength(1)
    expect(answerComments[0].props.author.id).toBe(student.id)
    expect(answerComments[0].props.author.name).toBe('John Doe')
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
    const student = makeStudent({
      name: 'John Doe',
      email: 'jonhdoe@email.com',
      password: 'password',
    })

    await inMemoryStudentsRepository.createStudent(student)

    const answer = await inMemoryAnswersRepository.createAnswer(
      makeAnswer({
        authorId: new UniqueEntityID(student.id),
      }),
    )

    await inMemoryAnswersCommentsRepository.create(
      makeAnswerComment({
        authorId: new UniqueEntityID(student.id),
        answerId: new UniqueEntityID(answer.id),
      }),
    )
    await inMemoryAnswersCommentsRepository.create(
      makeAnswerComment({
        authorId: new UniqueEntityID(student.id),
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
    expect(firstPageAnswerComments).toHaveLength(1)
    expect(firstPageAnswerComments[0].props.author.id).toBe(student.id)
    expect(firstPageAnswerComments[0].props.author.name).toBe('John Doe')

    expect(Success.is(secondResult)).toBe(true)
    expect(secondResult).toBeInstanceOf(Success)
    expect(secondPageAnswerComments).toHaveLength(1)
    expect(secondPageAnswerComments[0].props.author.id).toBe(student.id)
    expect(secondPageAnswerComments[0].props.author.name).toBe('John Doe')
  })
})
