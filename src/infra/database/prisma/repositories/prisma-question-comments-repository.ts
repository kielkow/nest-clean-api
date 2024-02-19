import { Injectable } from '@nestjs/common'

import { QuestionComment } from '@/domain/forum/enterprise/entities/question-comment'
import { QuestionsCommentsRepository } from '@/domain/forum/application/repositories/questions-comments-repository'

import { PrismaService } from '../prisma.service'
import { PrismaQuestionCommentMapper } from '../mappers/prisma-question-comment-mapper'
import { PrismaStudentsRepository } from './prisma-students-repository'
import { CommentWithAuthor } from '@/domain/forum/enterprise/entities/value-objects/comment-with-author'

@Injectable()
export class PrismaQuestionCommentsRepository
  implements QuestionsCommentsRepository
{
  constructor(
    private prisma: PrismaService,
    private studentsRepository?: PrismaStudentsRepository,
  ) {}

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
    })

    const studentsIds = prismaComments.map((comment) => comment.authorId)

    const students = await this.prisma.user.findMany({
      where: { id: { in: studentsIds } },
    })

    const commentsWithAuthor = prismaComments.map((prismaComment) => {
      return CommentWithAuthor.create({
        author: {
          id: prismaComment.authorId,
          name:
            students.find((student) => student.id === prismaComment.authorId)
              ?.name || 'Unknown',
        },
        comment: {
          id: prismaComment.id,
          content: prismaComment.content,
          createdAt: prismaComment.createdAt,
          updatedAt: prismaComment.updatedAt,
        },
      })
    })

    return commentsWithAuthor
  }

  async delete(id: string): Promise<void> {
    await this.prisma.comment.delete({
      where: { id, questionId: { not: null } },
    })
  }
}
