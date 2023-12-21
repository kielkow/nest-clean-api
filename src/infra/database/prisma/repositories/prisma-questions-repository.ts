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
    throw new Error('Method not implemented.')
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

  editQuestion(question: Question): Promise<void> {
    throw new Error('Method not implemented.')
  }

  listRecentQuestions(params: PaginationParams): Promise<Question[]> {
    throw new Error('Method not implemented.')
  }
}
