import { Attachment as PrismaAnswerAttachment } from '@prisma/client'

import { UniqueEntityID } from '@/core/entities/unique-entity-id'

import { AnswerAttachment } from '@/domain/forum/enterprise/entities/answer-attachment'

export class PrismaAnswerAttachmentMapper {
  static toDomain(
    prismaAnswerAttachment: PrismaAnswerAttachment,
  ): AnswerAttachment {
    const { id, answerId, createdAt, updatedAt } = prismaAnswerAttachment

    if (!answerId) throw new Error('Answer ID not found')

    const domainId = new UniqueEntityID(id)
    const domainAnswerId = new UniqueEntityID(answerId)

    return AnswerAttachment.create(
      {
        attachmentId: domainId,
        answerId: domainAnswerId,
      },
      domainId,
      createdAt,
      updatedAt,
    )
  }
}
