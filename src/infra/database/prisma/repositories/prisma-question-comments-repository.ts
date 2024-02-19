import { Injectable } from '@nestjs/common'

import { QuestionComment } from '@/domain/forum/enterprise/entities/question-comment'
import { CommentWithAuthor } from '@/domain/forum/enterprise/entities/value-objects/comment-with-author'
import { QuestionsCommentsRepository } from '@/domain/forum/application/repositories/questions-comments-repository'

import { PrismaService } from '../prisma.service'

import { PrismaQuestionCommentMapper } from '../mappers/prisma-question-comment-mapper'
import { PrismaCommentWithAuthorMapper } from '../mappers/prisma-comment-with-author-mapper'

@Injectable()
export class PrismaQuestionCommentsRepository
  implements QuestionsCommentsRepository
{
  constructor(private prisma: PrismaService) {}

  async create(questionComment: QuestionComment): Promise<QuestionComment> {
    const prismaComment = await this.prisma.comment.create({
      data: PrismaQuestionCommentMapper.toPersistence(questionComment),
    })

    return PrismaQuestionCommentMapper.toDomain(prismaComment)
  }

  async findById(id: string): Promise<QuestionComment | undefined> {
    const prismaComment = await this.prisma.comment.findUnique({
      where: { id, questionId: { not: null } },
    })

    return prismaComment
      ? PrismaQuestionCommentMapper.toDomain(prismaComment)
      : undefined
  }

  async findAll(params: {
    questionId: string
    page: number
    perPage: number
  }): Promise<QuestionComment[]> {
    const { questionId, page = 1, perPage = 10 } = params

    const prismaComments = await this.prisma.comment.findMany({
      take: perPage,
      skip: (page - 1) * perPage,
      where: { questionId },
    })

    return prismaComments.map(PrismaQuestionCommentMapper.toDomain)
  }

  async findManyByQuestionIdWithAuthor(params: {
    questionId: string
    page: number
    perPage: number
  }): Promise<CommentWithAuthor[]> {
    const { questionId, page = 1, perPage = 10 } = params

    const prismaComments = await this.prisma.comment.findMany({
      take: perPage,
      skip: (page - 1) * perPage,
      where: { questionId },
      include: {
        author: true,
      },
    })

    const commentsWithAuthor = prismaComments.map(
      PrismaCommentWithAuthorMapper.toDomain,
    )

    return commentsWithAuthor
  }

  async delete(id: string): Promise<void> {
    await this.prisma.comment.delete({
      where: { id, questionId: { not: null } },
    })
  }
}
