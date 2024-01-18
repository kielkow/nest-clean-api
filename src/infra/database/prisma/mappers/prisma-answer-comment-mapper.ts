import { Prisma, Comment as PrismaAnswerComment } from '@prisma/client'

import { UniqueEntityID } from '@/core/entities/unique-entity-id'

import { AnswerComment } from '@/domain/forum/enterprise/entities/answer-comment'

export class PrismaAnswerCommentMapper {
  static toDomain(prismaAnswerComment: PrismaAnswerComment): AnswerComment {
    const { id, content, authorId, answerId, createdAt, updatedAt } =
      prismaAnswerComment

    if (!answerId) throw new Error('Answer ID not found')

    const domainId = new UniqueEntityID(id)
    const domainAuthorId = new UniqueEntityID(authorId)
    const domainAnswerId = new UniqueEntityID(answerId)

    return AnswerComment.create(
      {
        content,
        authorId: domainAuthorId,
        answerId: domainAnswerId,
      },
      domainId,
      createdAt,
      updatedAt,
    )
  }

  static toPersistence(
    answercomment: AnswerComment,
  ): Prisma.CommentUncheckedCreateInput {
    const { id, content, authorId, answerId, createdAt, updatedAt } =
      answercomment

    return {
      id,
      content,
      authorId: authorId.id,
      answerId: answerId.id,
      createdAt,
      updatedAt,
    }
  }
}
