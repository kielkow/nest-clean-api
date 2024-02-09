import { Injectable } from '@nestjs/common'

import { PaginationParams } from '@/core/repositories/pagination-params'

import { Question } from '@/domain/forum/enterprise/entities/question'
import { QuestionsRepository } from '@/domain/forum/application/repositories/questions-repository'
import { QuestionAttachmentsRepository } from '@/domain/forum/application/repositories/question-attachments-repository'

import { PrismaService } from '../prisma.service'
import { PrismaQuestionMapper } from '../mappers/prisma-question-mapper'

@Injectable()
export class PrismaQuestionsRepository implements QuestionsRepository {
  constructor(
    private prisma: PrismaService,
    private questionAttachmentsRepository: QuestionAttachmentsRepository,
  ) {}

  async createQuestion(question: Question): Promise<Question> {
    const questionCreated = await this.prisma.question.create({
      data: PrismaQuestionMapper.toPersistence(question),
    })

    await this.questionAttachmentsRepository.createMany(
      question.attachments.getItems(),
    )

    return PrismaQuestionMapper.toDomain(questionCreated)
  }

  async findBySlug(slug: string): Promise<Question | undefined> {
    const question = await this.prisma.question.findUnique({
      where: { slug },
    })

    return question ? PrismaQuestionMapper.toDomain(question) : undefined
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
