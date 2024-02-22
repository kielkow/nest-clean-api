import { ResourceNotFoundError } from '@/core/errors'
import { Fail, Success } from '@/core/response-handling'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'

import { makeStudent } from '@/test/factories/make-student'
import { makeQuestion } from '@/test/factories/make-question'

import { InMemoryQuestionsRepository } from '@/test/repositories/in-memory-questions-repository'
import { InMemoryStudentsRepository } from '@/test/repositories/in-memory-students-repository'
import { InMemoryAttachmentsRepository } from '@/test/repositories/in-memory-attachments-repository'
import { InMemoryQuestionAttachmentsRepository } from '@/test/repositories/in-memory-question-attachments-repository'

import { FindQuestionBySlugUseCase } from '.'
import { makeQuestionAttachment } from '@/test/factories/make-question-attachment'
import { makeAttachment } from '@/test/factories/make-attachment'
import { makeQuestionAttachmentList } from '@/test/factories/make-question-attachment-list'

describe('FindQuestionBySlugUseCase', () => {
  let inMemoryQuestionsRepository: InMemoryQuestionsRepository,
    inMemoryStudentsRepository: InMemoryStudentsRepository,
    inMemoryAttachmentsRepository: InMemoryAttachmentsRepository,
    inMemoryQuestionAttachmentsRepository: InMemoryQuestionAttachmentsRepository

  let sut: FindQuestionBySlugUseCase

  beforeEach(() => {
    inMemoryStudentsRepository = new InMemoryStudentsRepository()
    inMemoryAttachmentsRepository = new InMemoryAttachmentsRepository()
    inMemoryQuestionAttachmentsRepository =
      new InMemoryQuestionAttachmentsRepository()

    inMemoryQuestionsRepository = new InMemoryQuestionsRepository(
      inMemoryQuestionAttachmentsRepository,
      inMemoryStudentsRepository,
      inMemoryAttachmentsRepository,
    )

    sut = new FindQuestionBySlugUseCase(inMemoryQuestionsRepository)
  })

  it('should be able to find question by slug', async () => {
    const student = makeStudent({
      name: 'John Doe',
      email: 'jonhdoe@email.com',
      password: 'password',
    })
    await inMemoryStudentsRepository.createStudent(student)

    const attachment = makeAttachment({
      title: 'attachment',
      type: 'image/png',
      size: 1000,
      url: 'http://attachment.com',
    })
    await inMemoryAttachmentsRepository.create(attachment)

    const question = makeQuestion({
      title: 'This is the title',
      authorId: new UniqueEntityID(student.id),
    })

    const questionAttachment = makeQuestionAttachment({
      attachmentId: new UniqueEntityID(attachment.id),
      questionId: new UniqueEntityID(question.id),
    })

    question.attachments = makeQuestionAttachmentList([questionAttachment])

    await inMemoryQuestionsRepository.createQuestion(question)

    const result = await sut.execute({ slug: 'this-is-the-title' })
    const questionDetails = result.getValue()

    expect(Success.is(result)).toBe(true)
    expect(result).toBeInstanceOf(Success)

    if (
      questionDetails &&
      !(questionDetails instanceof ResourceNotFoundError)
    ) {
      expect(questionDetails.props.id).toStrictEqual(
        new UniqueEntityID(question.id),
      )
      expect(questionDetails.props.title).toBe(question.title)
      expect(questionDetails.props.content).toBe(question.content)
      expect(questionDetails.props.slug).toBe(question.slug)

      expect(questionDetails.props.author.id).toStrictEqual(
        new UniqueEntityID(student.id),
      )
      expect(questionDetails.props.author.name).toBe('John Doe')

      expect(questionDetails.props.attachments).toHaveLength(1)
    }
  })

  it('should not be able to find question by slug if does not exists', async () => {
    const result = await sut.execute({ slug: 'this-is-the-title' })

    expect(Fail.is(result)).toBe(true)
    expect(result).toBeInstanceOf(Fail)
    expect(result).toEqual({ error: expect.any(ResourceNotFoundError) })
  })
})
