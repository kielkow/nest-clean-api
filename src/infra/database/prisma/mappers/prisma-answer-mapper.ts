import { Prisma, Answer as PrismaAnswer } from '@prisma/client'

import { UniqueEntityID } from '@/core/entities/unique-entity-id'

import { Answer } from '@/domain/forum/enterprise/entities/answer'

export class PrismaAnswerMapper {
  static toDomain(prismaAnswer: PrismaAnswer): Answer {
    const { id, content, authorId, questionId, createdAt, updatedAt } =
      prismaAnswer

    const domainId = new UniqueEntityID(id)
    const domainAuthorId = new UniqueEntityID(authorId)
    const domainQuestionId = new UniqueEntityID(questionId)

    return Answer.create(
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

  static toPersistence(answer: Answer): Prisma.AnswerUncheckedCreateInput {
    const { id, content, authorId, questionId, createdAt, updatedAt } = answer

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
