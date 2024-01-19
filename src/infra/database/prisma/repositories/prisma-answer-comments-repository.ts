import { Injectable } from '@nestjs/common'

import { AnswerComment } from '@/domain/forum/enterprise/entities/answer-comment'
import { AnswersCommentsRepository } from '@/domain/forum/application/repositories/answers-comments-repository'

import { PrismaService } from '../prisma.service'
import { PrismaAnswerCommentMapper } from '../mappers/prisma-answer-comment-mapper'

@Injectable()
export class PrismaAnswerCommentsRepository
  implements AnswersCommentsRepository
{
  constructor(private prisma: PrismaService) {}

  async create(answerComment: AnswerComment): Promise<AnswerComment> {
    const prismaComment = await this.prisma.comment.create({
      data: PrismaAnswerCommentMapper.toPersistence(answerComment),
    })

    return PrismaAnswerCommentMapper.toDomain(prismaComment)
  }

  async findById(id: string): Promise<AnswerComment | undefined> {
    const prismaComment = await this.prisma.comment.findUnique({
      where: { id, answerId: { not: null } },
    })

    return prismaComment
      ? PrismaAnswerCommentMapper.toDomain(prismaComment)
      : undefined
  }

  async findAll(params: {
    answerId: string
    page: number
    perPage: number
  }): Promise<AnswerComment[]> {
    const { answerId, page = 1, perPage = 10 } = params

    const prismaComments = await this.prisma.comment.findMany({
      take: perPage,
      skip: (page - 1) * perPage,
      where: { answerId },
    })

    return prismaComments.map(PrismaAnswerCommentMapper.toDomain)
  }

  async delete(id: string): Promise<void> {
    await this.prisma.comment.delete({
      where: { id, answerId: { not: null } },
    })
  }
}
