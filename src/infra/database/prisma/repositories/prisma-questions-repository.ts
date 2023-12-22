import { Injectable } from '@nestjs/common'

import { Question } from '@/domain/forum/enterprise/entities/question'
import { PaginationParams } from '@/core/repositories/pagination-params'
import { QuestionsRepository } from '@/domain/forum/application/repositories/questions-repository'

import { PrismaService } from '../prisma.service'
import { PrismaQuestionMapper } from '../mappers/prisma-question-mapper'

@Injectable()
export class PrismaQuestionsRepository implements QuestionsRepository {
  constructor(private prisma: PrismaService) {}

  async createQuestion(question: Question): Promise<Question> {
    const questionCreated = await this.prisma.question.create({
      data: PrismaQuestionMapper.toPersistence(question),
    })

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
  }

  async editQuestion(question: Question): Promise<void> {
    await this.prisma.question.update({
      where: { id: question.id },
      data: PrismaQuestionMapper.toPersistence(question),
    })
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
