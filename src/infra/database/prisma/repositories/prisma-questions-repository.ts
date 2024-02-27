import { Injectable } from '@nestjs/common'

import { DomainEvents } from '@/core/events/domain-events'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { PaginationParams } from '@/core/repositories/pagination-params'

import { CacheRepository } from '@/infra/cache/cache-repository'

import { Question } from '@/domain/forum/enterprise/entities/question'
import { QuestionsRepository } from '@/domain/forum/application/repositories/questions-repository'
import { QuestionAttachmentsRepository } from '@/domain/forum/application/repositories/question-attachments-repository'
import { QuestionDetails } from '@/domain/forum/enterprise/entities/value-objects/question-details'

import { PrismaService } from '../prisma.service'
import { PrismaQuestionMapper } from '../mappers/prisma-question-mapper'

@Injectable()
export class PrismaQuestionsRepository implements QuestionsRepository {
  constructor(
    private prisma: PrismaService,
    private cacheRepository: CacheRepository,
    private questionAttachmentsRepository: QuestionAttachmentsRepository,
  ) {}

  async createQuestion(question: Question): Promise<Question> {
    const questionCreated = await this.prisma.question.create({
      data: PrismaQuestionMapper.toPersistence(question),
    })

    await this.questionAttachmentsRepository.createMany(
      question.attachments.getItems(),
    )

    DomainEvents.dispatchPublisherEventsForAggregate(
      new UniqueEntityID(question.id),
    )

    return PrismaQuestionMapper.toDomain(questionCreated)
  }

  async findBySlug(slug: string): Promise<Question | undefined> {
    const question = await this.prisma.question.findUnique({
      where: { slug },
    })

    return question ? PrismaQuestionMapper.toDomain(question) : undefined
  }

  async findBySlugWithDetails(
    slug: string,
  ): Promise<QuestionDetails | undefined> {
    const cachedQuestion = await this.cacheRepository.get(
      `question:${slug}:details`,
    )

    if (cachedQuestion) return JSON.parse(cachedQuestion)

    const question = await this.prisma.question.findUnique({
      where: { slug },
      include: { author: true, attachments: true },
    })

    if (!question) return undefined

    const questionDetails = PrismaQuestionMapper.toDetails(question)

    await this.cacheRepository.set(
      `question:${question.id}:details`,
      JSON.stringify(questionDetails),
    )

    return questionDetails
  }

  async findById(id: string): Promise<Question | undefined> {
    const question = await this.prisma.question.findUnique({
      where: { id },
    })

    return question ? PrismaQuestionMapper.toDomain(question) : undefined
  }

  async deleteQuestion(id: string): Promise<void> {
    await this.prisma.question.delete({
      where: { id },
    })

    await this.questionAttachmentsRepository.deleteByQuestionId(id)
  }

  async editQuestion(question: Question): Promise<void> {
    await this.prisma.question.update({
      where: { id: question.id },
      data: PrismaQuestionMapper.toPersistence(question),
    })

    await Promise.all([
      this.questionAttachmentsRepository.createMany(
        question.attachments.getNewItems(),
      ),
      this.questionAttachmentsRepository.deleteMany(
        question.attachments
          .getRemovedItems()
          .map((attachment) => attachment.id),
      ),
    ])

    DomainEvents.dispatchPublisherEventsForAggregate(
      new UniqueEntityID(question.id),
    )

    await this.cacheRepository.delete(`question:${question.id}:details`)
  }

  async listRecentQuestions(params: PaginationParams): Promise<Question[]> {
    const { page = 1, perPage = 10 } = params

    const prismaQuestions = await this.prisma.question.findMany({
      take: perPage,
      skip: (page - 1) * perPage,
      orderBy: { createdAt: 'desc' },
    })

    const questions = prismaQuestions.map(PrismaQuestionMapper.toDomain)

    return questions
  }
}
