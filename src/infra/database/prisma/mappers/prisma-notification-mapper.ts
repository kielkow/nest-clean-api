import { Prisma, Notification as PrismaNotification } from '@prisma/client'

import { UniqueEntityID } from '@/core/entities/unique-entity-id'

import { Notification } from '@/domain/notification/enterprise/entities/notification'

export class PrismaNotificationMapper {
  static toDomain(prismaNotification: PrismaNotification): Notification {
    const {
      id,
      recipientId,
      title,
      content,
      read,
      readAt,
      createdAt,
      updatedAt,
    } = prismaNotification

    const domainId = new UniqueEntityID(id)
    const domainRecipientId = new UniqueEntityID(recipientId)

    return Notification.create(
      {
        recipientId: domainRecipientId,
        title,
        content,
        read,
        readAt: readAt || undefined,
      },
      domainId,
      createdAt,
      updatedAt,
    )
  }

  static toPersistence(
    notification: Notification,
  ): Prisma.NotificationUncheckedCreateInput {
    const { id, recipientId, title, content, read, createdAt, updatedAt } =
      notification

    return {
      id,
      recipientId: recipientId.id,
      title,
      content,
      read,
      createdAt,
      updatedAt,
    }
  }
}
