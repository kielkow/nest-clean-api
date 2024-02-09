import { Prisma, Attachment as PrismaQuestionAttachment } from '@prisma/client'

import { UniqueEntityID } from '@/core/entities/unique-entity-id'

import { QuestionAttachment } from '@/domain/forum/enterprise/entities/question-attachment'

export class PrismaQuestionAttachmentMapper {
  static toDomain(
    prismaQuestionAttachment: PrismaQuestionAttachment,
  ): QuestionAttachment {
    const { id, questionId, createdAt, updatedAt } = prismaQuestionAttachment

    if (!questionId) throw new Error('Question ID not found')

    const domainId = new UniqueEntityID(id)
    const domainQuestionId = new UniqueEntityID(questionId)

    return QuestionAttachment.create(
      {
        attachmentId: domainId,
        questionId: domainQuestionId,
      },
      domainId,
      createdAt,
      updatedAt,
    )
  }

  static toPersistence(
    questionAttachment: QuestionAttachment,
  ): Prisma.AttachmentUpdateArgs {
    return {
      where: { id: questionAttachment.attachmentId.id },
      data: {
        questionId: questionAttachment.questionId.id,
      },
    }
  }

  static toPersistenceMany(
    questionAttachment: QuestionAttachment[],
  ): Prisma.AttachmentUpdateManyArgs {
    const ids = questionAttachment.map((qa) => qa.attachmentId.id)

    return {
      where: {
        id: {
          in: ids,
        },
      },
      data: {
        questionId: questionAttachment.length
          ? questionAttachment[0].questionId.id
          : undefined,
      },
    }
  }
}
