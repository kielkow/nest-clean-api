import { Injectable } from '@nestjs/common'

import { Notification } from '@/domain/notification/enterprise/entities/notification'
import { NotificationsRepository } from '@/domain/notification/application/repositories/notifications-repository'

import { PrismaService } from '../prisma.service'
import { PrismaNotificationMapper } from '../mappers/prisma-notification-mapper'

@Injectable()
export class PrismaNotificationRepository implements NotificationsRepository {
  constructor(private prisma: PrismaService) {}

  async findById(id: string): Promise<Notification | undefined> {
    const notification = await this.prisma.notification.findUnique({
      where: { id },
    })

    return notification
      ? PrismaNotificationMapper.toDomain(notification)
      : undefined
  }

  async markAsRead(id: string) {
    await this.prisma.notification.update({
      where: { id },
      data: { read: true, readAt: new Date() },
    })
  }

  async sendNotification(notification: Notification) {
    const data = PrismaNotificationMapper.toPersistence(notification)

    await this.prisma.notification.create({ data })
  }

  async findByRecipientId(recipientId: string): Promise<Notification[]> {
    const notifications = await this.prisma.notification.findMany({
      where: { recipientId },
    })

    return notifications.map(PrismaNotificationMapper.toDomain)
  }
}
