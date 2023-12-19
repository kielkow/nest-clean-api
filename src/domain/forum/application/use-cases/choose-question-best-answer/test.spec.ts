import { Fail, Success } from '@/core/response-handling'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'

import { makeAnswer } from '@/test/factories/make-answer'
import { makeQuestion } from '@/test/factories/make-question'

import { InMemoryAnswersRepository } from '@/test/repositories/in-memory-answers-repository'
import { InMemoryQuestionsRepository } from '@/test/repositories/in-memory-questions-repository'

import { ChooseQuestionBestAnswerUseCase } from '.'

import { NotAllowedError, ResourceNotFoundError } from '@/core/errors'

describe('ChooseQuestionBestAnswerUseCase', () => {
  let inMemoryAnswersRepository: InMemoryAnswersRepository
  let inMemoryQuestionsRepository: InMemoryQuestionsRepository
  let sut: ChooseQuestionBestAnswerUseCase

  beforeEach(() => {
    inMemoryAnswersRepository = new InMemoryAnswersRepository()
    inMemoryQuestionsRepository = new InMemoryQuestionsRepository()

    sut = new ChooseQuestionBestAnswerUseCase(
      inMemoryAnswersRepository,
      inMemoryQuestionsRepository,
    )
  })

  it('should be able to choose question best answer', async () => {
    const question = await inMemoryQuestionsRepository.createQuestion(
      makeQuestion(),
    )

    const answer = await inMemoryAnswersRepository.createAnswer(
      makeAnswer({
        questionId: new UniqueEntityID(question.id),
      }),
    )

    const result = await sut.execute({
      authorId: question.authorId.id,
      answerId: answer.id,
      questionId: question.id,
    })

    const questionEdited = await inMemoryQuestionsRepository.findById(
      question.id,
    )

    expect(questionEdited).toBeTruthy()
    expect(questionEdited?.bestAnswerId).toBeTruthy()
    expect(questionEdited?.bestAnswerId?.id).toEqual(answer.id)

    expect(Success.is(result)).toBe(true)
    expect(result).toBeInstanceOf(Success)
  })

  it('should not be able to choose question best answer if question does not exist', async () => {
    const result = await sut.execute({
      authorId: 'any_author_id',
      answerId: 'any_answer_id',
      questionId: 'any_question_id',
    })

    expect(Fail.is(result)).toBe(true)
    expect(result).toBeInstanceOf(Fail)
    expect(result).toEqual({ error: expect.any(ResourceNotFoundError) })
  })

  it('should not be able to choose question best answer if answer does not exist', async () => {
    const question = await inMemoryQuestionsRepository.createQuestion(
      makeQuestion(),
    )

    const result = await sut.execute({
      authorId: question.authorId.id,
      answerId: 'any_answer_id',
      questionId: question.id,
    })

    expect(Fail.is(result)).toBe(true)
    expect(result).toBeInstanceOf(Fail)
    expect(result).toEqual({ error: expect.any(ResourceNotFoundError) })
  })

  it('should not be able to choose question best answer if answer does not belong to the question', async () => {
    const question = await inMemoryQuestionsRepository.createQuestion(
      makeQuestion(),
    )

    const answer = await inMemoryAnswersRepository.createAnswer(makeAnswer())

    const result = await sut.execute({
      authorId: question.authorId.id,
      answerId: answer.id,
      questionId: question.id,
    })

    expect(Fail.is(result)).toBe(true)
    expect(result).toBeInstanceOf(Fail)
    expect(result).toEqual({ error: expect.any(NotAllowedError) })
  })

  it('should not be able to choose question best answer if author is not the question author', async () => {
    const question = await inMemoryQuestionsRepository.createQuestion(
      makeQuestion(),
    )

    const answer = await inMemoryAnswersRepository.createAnswer(
      makeAnswer({
        questionId: new UniqueEntityID(question.id),
      }),
    )

    const result = await sut.execute({
      authorId: 'any_author_id',
      answerId: answer.id,
      questionId: question.id,
    })

    expect(Fail.is(result)).toBe(true)
    expect(result).toBeInstanceOf(Fail)
    expect(result).toEqual({ error: expect.any(NotAllowedError) })
  })
})
