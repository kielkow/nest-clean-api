import { Injectable } from '@nestjs/common'

import { Answer } from '@/domain/forum/enterprise/entities/answer'
import { AnswersRepository } from '@/domain/forum/application/repositories/answers-repository'

import { PrismaService } from '../prisma.service'
import { PrismaAnswerMapper } from '../mappers/prisma-answer-mapper'

@Injectable()
export class PrismaAnswersRepository implements AnswersRepository {
  constructor(private prisma: PrismaService) {}

  async createAnswer(answer: Answer): Promise<Answer> {
    const prismaAnswer = await this.prisma.answer.create({
      data: PrismaAnswerMapper.toPersistence(answer),
    })

    return PrismaAnswerMapper.toDomain(prismaAnswer)
  }

  async findById(id: string): Promise<Answer | undefined> {
    const prismaAnswer = await this.prisma.answer.findUnique({
      where: { id },
    })

    return prismaAnswer ? PrismaAnswerMapper.toDomain(prismaAnswer) : undefined
  }

  async findByQuestionID(questionId: string): Promise<Answer[]> {
    const prismaAnswers = await this.prisma.answer.findMany({
      where: { questionId },
    })

    return prismaAnswers.map(PrismaAnswerMapper.toDomain)
  }

  async deleteAnswer(id: string): Promise<void> {
    await this.prisma.answer.delete({
      where: { id },
    })
  }

  async editAnswer(answer: Answer): Promise<void> {
    await this.prisma.answer.update({
      where: { id: answer.id },
      data: PrismaAnswerMapper.toPersistence(answer),
    })
  }

  async listQuetionAnswers(params: {
    questionId: string
    page: number
    perPage: number
  }): Promise<Answer[]> {
    const { questionId, page = 1, perPage = 10 } = params

    const prismaAnswers = await this.prisma.answer.findMany({
      take: perPage,
      skip: (page - 1) * perPage,
      where: { questionId },
    })

    return prismaAnswers.map(PrismaAnswerMapper.toDomain)
  }
}
