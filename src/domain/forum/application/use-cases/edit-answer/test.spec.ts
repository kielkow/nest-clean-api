import { Success, Fail } from '@/core/response-handling'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'

import { AnswerAttachment } from '@/domain/forum/enterprise/entities/answer-attachment'

import { makeAnswer } from '@/test/factories/make-answer'
import { InMemoryAnswersRepository } from '@/test/repositories/in-memory-answers-repository'
import { InMemoryAnswerAttachmentsRepository } from '@/test/repositories/in-memory-answer-attachments-repository'

import { NotAllowedError, ResourceNotFoundError } from '@/core/errors'

import { EditAnswerUseCase } from '.'

describe('EditAnswerUseCase', () => {
  let inMemoryAnswersRepository: InMemoryAnswersRepository,
    inMemoryAnswerAttachmentsRepository: InMemoryAnswerAttachmentsRepository

  let sut: EditAnswerUseCase

  beforeEach(() => {
    inMemoryAnswersRepository = new InMemoryAnswersRepository()
    inMemoryAnswerAttachmentsRepository =
      new InMemoryAnswerAttachmentsRepository()

    sut = new EditAnswerUseCase(
      inMemoryAnswersRepository,
      inMemoryAnswerAttachmentsRepository,
    )
  })

  it('should be able to edit an answer', async () => {
    const answer = await inMemoryAnswersRepository.createAnswer(makeAnswer())

    const result = await sut.execute({
      id: answer.id,
      authorId: answer.authorId.id,
      content: 'Edit Content',
    })

    const answerEdited = await inMemoryAnswersRepository.findById(answer.id)

    expect(answerEdited).toBeTruthy()
    expect(answerEdited?.content).toBe('Edit Content')

    expect(Success.is(result)).toBe(true)
    expect(result).toBeInstanceOf(Success)
  })

  it('should not be able to edit an answer if is not the author', async () => {
    const answer = await inMemoryAnswersRepository.createAnswer(makeAnswer())

    const result = await sut.execute({
      id: answer.id,
      authorId: 'non-author-id',
      content: 'Edit Content',
    })

    expect(Fail.is(result)).toBe(true)
    expect(result).toBeInstanceOf(Fail)
    expect(result).toEqual({ error: expect.any(NotAllowedError) })
  })

  it('should not be able to edit an answer if does not exists', async () => {
    const result = await sut.execute({
      id: 'non-existing-answer-id',
      authorId: 'any-author-id',
      content: 'Edit Content',
    })

    expect(Fail.is(result)).toBe(true)
    expect(result).toBeInstanceOf(Fail)
    expect(result).toEqual({ error: expect.any(ResourceNotFoundError) })
  })

  it('should be able to edit an answer attachments', async () => {
    const answer = await inMemoryAnswersRepository.createAnswer(makeAnswer())

    const payloadAttachment = AnswerAttachment.create({
      answerId: new UniqueEntityID(answer.id),
      attachmentId: new UniqueEntityID(),
    })

    const attachment = await inMemoryAnswerAttachmentsRepository.create(
      payloadAttachment,
    )

    const result = await sut.execute({
      id: answer.id,
      authorId: answer.authorId.id,
      content: 'Edit Content',
      attachmentsIds: [attachment.id],
    })

    const answerEdited = await inMemoryAnswersRepository.findById(answer.id)

    expect(answerEdited).toBeTruthy()
    expect(answerEdited?.content).toBe('Edit Content')
    expect(answerEdited?.attachments.getItems()).toHaveLength(1)

    expect(Success.is(result)).toBe(true)
    expect(result).toBeInstanceOf(Success)
  })
})
