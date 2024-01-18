import { Prisma, Comment as PrismaQuestionComment } from '@prisma/client'

import { UniqueEntityID } from '@/core/entities/unique-entity-id'

import { QuestionComment } from '@/domain/forum/enterprise/entities/question-comment'

export class PrismaQuestionCommentMapper {
  static toDomain(
    prismaQuestionComment: PrismaQuestionComment,
  ): QuestionComment {
    const { id, content, authorId, questionId, createdAt, updatedAt } =
      prismaQuestionComment

    if (!questionId) throw new Error('Question ID not found')

    const domainId = new UniqueEntityID(id)
    const domainAuthorId = new UniqueEntityID(authorId)
    const domainQuestionId = new UniqueEntityID(questionId)

    return QuestionComment.create(
      {
        content,
        authorId: domainAuthorId,
        questionId: domainQuestionId,
      },
      domainId,
      createdAt,
      updatedAt,
    )
  }

  static toPersistence(
    questioncomment: QuestionComment,
  ): Prisma.CommentUncheckedCreateInput {
    const { id, content, authorId, questionId, createdAt, updatedAt } =
      questioncomment

    return {
      id,
      content,
      authorId: authorId.id,
      questionId: questionId.id,
      createdAt,
      updatedAt,
    }
  }
}
