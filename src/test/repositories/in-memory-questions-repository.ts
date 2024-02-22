import { DomainEvents } from '@/core/events/domain-events'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { PaginationParams } from '@/core/repositories/pagination-params'

import { Question } from '@/domain/forum/enterprise/entities/question'
import { QuestionsRepository } from '@/domain/forum/application/repositories/questions-repository'
import { QuestionDetails } from '@/domain/forum/enterprise/entities/value-objects/question-details'

import { InMemoryStudentsRepository } from './in-memory-students-repository'
import { InMemoryAttachmentsRepository } from './in-memory-attachments-repository'
import { InMemoryQuestionAttachmentsRepository } from './in-memory-question-attachments-repository'

export class InMemoryQuestionsRepository implements QuestionsRepository {
  private questions: Question[] = []

  constructor(
    private questionAttachmentsRepository?: InMemoryQuestionAttachmentsRepository,
    private studentsRepository?: InMemoryStudentsRepository,
    private attachmentsRepository?: InMemoryAttachmentsRepository,
  ) {}

  async createQuestion(question: Question): Promise<Question> {
    this.questions.push(question)

    await this.questionAttachmentsRepository?.createMany(
      question.attachments.getItems(),
    )

    return question
  }

  async findBySlug(slug: string): Promise<Question | undefined> {
    return this.questions.find((question) => question.slug.value === slug)
  }

  async findBySlugWithDetails(
    slug: string,
  ): Promise<QuestionDetails | undefined> {
    if (!this.studentsRepository) {
      throw new Error('Students repository must be provided')
    }
    if (!this.attachmentsRepository) {
      throw new Error('Attachments repository must be provided')
    }

    const question = this.questions.find(
      (question) => question.slug.value === slug,
    )
    if (!question) return undefined

    const student = this.studentsRepository.students.find(
      (student) => student.id === question?.authorId.id,
    )
    if (!student) throw new Error('Author not found')

    const questionAttachments = question.attachments.getItems()
    const attachments = this.attachmentsRepository.attachments.filter(
      (attachment) =>
        questionAttachments.find((a) => a.attachmentId.id === attachment.id),
    )

    return QuestionDetails.create({
      id: new UniqueEntityID(question.id),
      title: question.title,
      slug: question.slug,
      content: question.content,
      bestAnswerId: question.bestAnswerId,

      author: {
        id: new UniqueEntityID(student.id),
        name: student.name,
      },

      attachments,

      createdAt: question.createdAt,
      updatedAt: question.updatedAt,
    })
  }

  async findById(id: string): Promise<Question | undefined> {
    return this.questions.find((question) => question.id === id)
  }

  async deleteQuestion(id: string): Promise<void> {
    this.questions = this.questions.filter((question) => question.id !== id)

    if (!this.questionAttachmentsRepository) {
      throw new Error('Question attachments repository must be provided')
    }

    await this.questionAttachmentsRepository.deleteByQuestionId(id)
  }

  async editQuestion(question: Question): Promise<void> {
    const index = this.questions.findIndex((q) => q.id === question.id)
    this.questions[index] = question

    await this.questionAttachmentsRepository?.createMany(
      this.questions[index].attachments.getNewItems(),
    )

    await this.questionAttachmentsRepository?.deleteMany(
      this.questions[index].attachments
        .getRemovedItems()
        .map((attachment) => attachment.id),
    )

    if (question.bestAnswerId) {
      DomainEvents.dispatchPublisherEventsForAggregate(
        new UniqueEntityID(question.id),
      )
    }
  }

  async listRecentQuestions(params: PaginationParams): Promise<Question[]> {
    const page = params.page || 1
    const perPage = params.perPage || 10

    return this.questions
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .slice((page - 1) * perPage, page * perPage)
  }
}
