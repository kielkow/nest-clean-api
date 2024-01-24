import { Attachment as PrismaQuestionAttachment } from '@prisma/client'

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
  ): PrismaQuestionAttachment {
    const { attachmentId, questionId, createdAt, updatedAt } =
      questionAttachment

    return {
      id: attachmentId.id,
      title: '',
      url: '',
      answerId: null,
      questionId: questionId.id,
      createdAt,
      updatedAt: updatedAt || new Date(),
    }
  }
}