import { Fail, Success } from '@/core/response-handling'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'

import { makeQuestion } from '@/test/factories/make-question'
import { makeQuestionComment } from '@/test/factories/make-question-comment'
import { makeStudent } from '@/test/factories/make-student'

import { InMemoryQuestionsRepository } from '@/test/repositories/in-memory-questions-repository'
import { InMemoryQuestionsCommentsRepository } from '@/test/repositories/in-memory-questions-comments-repository'
import { InMemoryStudentsRepository } from '@/test/repositories/in-memory-students-repository'

import { ResourceNotFoundError } from '@/core/errors'

import { ListQuestionCommentsUseCase } from '.'

describe('CommentOnQuestionUseCase', () => {
  let inMemoryQuestionsCommentsRepository: InMemoryQuestionsCommentsRepository,
    inMemoryQuestionsRepository: InMemoryQuestionsRepository,
    inMemoryStudentsRepository: InMemoryStudentsRepository

  let sut: ListQuestionCommentsUseCase

  beforeEach(() => {
    inMemoryStudentsRepository = new InMemoryStudentsRepository()

    inMemoryQuestionsCommentsRepository =
      new InMemoryQuestionsCommentsRepository(inMemoryStudentsRepository)

    inMemoryQuestionsRepository = new InMemoryQuestionsRepository()

    sut = new ListQuestionCommentsUseCase(
      inMemoryQuestionsRepository,
      inMemoryQuestionsCommentsRepository,
    )
  })

  it('should be able to list comments from question', async () => {
    const student = makeStudent({
      name: 'John Doe',
      email: 'jonhdoe@email.com',
      password: 'password',
    })

    await inMemoryStudentsRepository.createStudent(student)

    const question = await inMemoryQuestionsRepository.createQuestion(
      makeQuestion({
        authorId: new UniqueEntityID(student.id),
      }),
    )

    await inMemoryQuestionsCommentsRepository.create(
      makeQuestionComment({
        authorId: new UniqueEntityID(student.id),
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
    expect(questionComments).toHaveLength(1)
    expect(questionComments[0].props.author.id).toBe(student.id)
    expect(questionComments[0].props.author.name).toBe('John Doe')
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
    const student = makeStudent({
      name: 'John Doe',
      email: 'jonhdoe@email.com',
      password: 'password',
    })

    await inMemoryStudentsRepository.createStudent(student)

    const question = await inMemoryQuestionsRepository.createQuestion(
      makeQuestion({
        authorId: new UniqueEntityID(student.id),
      }),
    )

    await inMemoryQuestionsCommentsRepository.create(
      makeQuestionComment({
        authorId: new UniqueEntityID(student.id),
        questionId: new UniqueEntityID(question.id),
      }),
    )
    await inMemoryQuestionsCommentsRepository.create(
      makeQuestionComment({
        authorId: new UniqueEntityID(student.id),
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
    expect(firstPageQuestionComments).toHaveLength(1)
    expect(firstPageQuestionComments[0].props.author.id).toBe(student.id)
    expect(firstPageQuestionComments[0].props.author.name).toBe('John Doe')

    expect(Success.is(secondResult)).toBe(true)
    expect(secondResult).toBeInstanceOf(Success)
    expect(secondPageQuestionComments).toHaveLength(1)
    expect(secondPageQuestionComments[0].props.author.id).toBe(student.id)
    expect(secondPageQuestionComments[0].props.author.name).toBe('John Doe')
  })
})
