import { faker } from '@faker-js/faker'
import { Injectable } from '@nestjs/common'

import { UniqueEntityID } from '@/core/entities/unique-entity-id'

import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { PrismaNotificationMapper } from '@/infra/database/prisma/mappers/prisma-notification-mapper'

import {
  Notification,
  NotificationProps,
} from '@/domain/notification/enterprise/entities/notification'

export function makeNotification(
  props: Partial<NotificationProps> = {},
  id?: UniqueEntityID,
): Notification {
  return Notification.create(
    {
      recipientId: props.recipientId || new UniqueEntityID(),
      title: faker.lorem.sentence(),
      content: faker.lorem.text(),
      read: false,
      ...props,
    },
    id,
  )
}

@Injectable()
export class NotificationFactory {
  constructor(private prisma: PrismaService) {}

  async makePrismaNotification(
    props: Partial<NotificationProps> = {},
    id?: UniqueEntityID,
  ): Promise<Notification> {
    const notification = makeNotification(props, id)

    await this.prisma.notification.create({
      data: PrismaNotificationMapper.toPersistence(notification),
    })

    return notification
  }
}
