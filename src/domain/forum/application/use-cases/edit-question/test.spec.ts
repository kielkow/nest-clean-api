import { Success, Fail } from '@/core/response-handling'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'

import { makeQuestion } from '@/test/factories/make-question'
import { InMemoryQuestionsRepository } from '@/test/repositories/in-memory-questions-repository'
import { InMemoryQuestionAttachmentsRepository } from '@/test/repositories/in-memory-question-attachments-repository'

import { QuestionAttachment } from '@/domain/forum/enterprise/entities/question-attachment'

import { NotAllowedError, ResourceNotFoundError } from '@/core/errors'

import { EditQuestionUseCase } from '.'

describe('EditQuestionUseCase', () => {
  let inMemoryQuestionsRepository: InMemoryQuestionsRepository,
    inMemoryQuestionAttachmentsRepository: InMemoryQuestionAttachmentsRepository

  let sut: EditQuestionUseCase

  beforeEach(() => {
    inMemoryQuestionAttachmentsRepository =
      new InMemoryQuestionAttachmentsRepository()

    inMemoryQuestionsRepository = new InMemoryQuestionsRepository(
      inMemoryQuestionAttachmentsRepository,
    )

    sut = new EditQuestionUseCase(
      inMemoryQuestionsRepository,
      inMemoryQuestionAttachmentsRepository,
    )
  })

  it('should be able to edit an question', async () => {
    const question = await inMemoryQuestionsRepository.createQuestion(
      makeQuestion(),
    )

    const result = await sut.execute({
      id: question.id,
      authorId: question.authorId.id,
      title: 'Edit Title',
      content: 'Edit Content',
    })

    const questionEdited = await inMemoryQuestionsRepository.findById(
      question.id,
    )

    expect(questionEdited).toBeTruthy()
    expect(questionEdited?.title).toBe('Edit Title')
    expect(questionEdited?.content).toBe('Edit Content')

    expect(Success.is(result)).toBe(true)
    expect(result).toBeInstanceOf(Success)
  })

  it('should not be able to edit an question if is not the author', async () => {
    const question = await inMemoryQuestionsRepository.createQuestion(
      makeQuestion(),
    )

    const result = await sut.execute({
      id: question.id,
      authorId: 'non-author-id',
      title: 'Edit Title',
      content: 'Edit Content',
    })

    expect(Fail.is(result)).toBe(true)
    expect(result).toBeInstanceOf(Fail)
    expect(result).toEqual({ error: expect.any(NotAllowedError) })
  })

  it('should not be able to edit an question if does not exists', async () => {
    const result = await sut.execute({
      id: 'non-existing-question-id',
      authorId: 'any-author-id',
      title: 'Edit Title',
      content: 'Edit Content',
    })

    expect(Fail.is(result)).toBe(true)
    expect(result).toBeInstanceOf(Fail)
    expect(result).toEqual({ error: expect.any(ResourceNotFoundError) })
  })

  it('should be able to edit an question attachments', async () => {
    const question = await inMemoryQuestionsRepository.createQuestion(
      makeQuestion(),
    )

    const payloadAttachment = QuestionAttachment.create({
      questionId: new UniqueEntityID(question.id),
      attachmentId: new UniqueEntityID(),
    })

    const attachment = await inMemoryQuestionAttachmentsRepository.create(
      payloadAttachment,
    )

    const result = await sut.execute({
      id: question.id,
      authorId: question.authorId.id,
      title: 'Edit Title',
      content: 'Edit Content',
      attachmentsIds: [attachment.id],
    })

    const questionEdited = await inMemoryQuestionsRepository.findById(
      question.id,
    )

    expect(questionEdited).toBeTruthy()
    expect(questionEdited?.title).toBe('Edit Title')
    expect(questionEdited?.content).toBe('Edit Content')
    expect(questionEdited?.attachments.getItems()).toHaveLength(1)

    expect(Success.is(result)).toBe(true)
    expect(result).toBeInstanceOf(Success)
  })

  it('should be able to add and remove new attachments', async () => {
    const question = await inMemoryQuestionsRepository.createQuestion(
      makeQuestion(),
    )

    const payloadAttachment = QuestionAttachment.create({
      questionId: new UniqueEntityID(question.id),
      attachmentId: new UniqueEntityID(),
    })
    const attachment = await inMemoryQuestionAttachmentsRepository.create(
      payloadAttachment,
    )

    await sut.execute({
      id: question.id,
      authorId: question.authorId.id,
      title: 'Edit Title',
      content: 'Edit Content',
      attachmentsIds: [attachment.id],
    })

    const newPayloadAttachment = QuestionAttachment.create({
      questionId: new UniqueEntityID(question.id),
      attachmentId: new UniqueEntityID(),
    })
    const newAttachment = await inMemoryQuestionAttachmentsRepository.create(
      newPayloadAttachment,
    )

    const result = await sut.execute({
      id: question.id,
      authorId: question.authorId.id,
      title: 'Edit Title',
      content: 'Edit Content',
      attachmentsIds: [newAttachment.id],
    })

    const questionEdited = await inMemoryQuestionsRepository.findById(
      question.id,
    )

    expect(questionEdited).toBeTruthy()
    expect(questionEdited?.title).toBe('Edit Title')
    expect(questionEdited?.content).toBe('Edit Content')
    expect(questionEdited?.attachments.getItems()).toHaveLength(1)

    expect(
      inMemoryQuestionAttachmentsRepository.questionAttachments,
    ).toHaveLength(1)
    expect(
      inMemoryQuestionAttachmentsRepository.questionAttachments[0].attachmentId
        .id,
    ).toEqual(newAttachment.id)

    expect(Success.is(result)).toBe(true)
    expect(result).toBeInstanceOf(Success)
  })
})
