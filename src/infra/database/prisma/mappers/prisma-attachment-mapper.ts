import { Prisma, Attachment as PrismaAttachment } from '@prisma/client'

import { UniqueEntityID } from '@/core/entities/unique-entity-id'

import { Attachment } from '@/domain/forum/enterprise/entities/attachment'

export class PrismaAttachmentMapper {
  static toDomain(prismaAttachment: PrismaAttachment): Attachment {
    const { id, title, type, size, url, createdAt, updatedAt } =
      prismaAttachment

    const domainId = new UniqueEntityID(id)

    return Attachment.create(
      {
        title,
        type,
        size,
        url,
      },
      domainId,
      createdAt,
      updatedAt,
    )
  }

  static toPersistence(
    attachment: Attachment,
  ): Prisma.AttachmentUncheckedCreateInput {
    const { id, title, type, size, url, createdAt, updatedAt } = attachment

    return {
      id,
      title,
      type,
      size,
      url,
      createdAt,
      updatedAt,
    }
  }
}
