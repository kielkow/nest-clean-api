import { Injectable } from '@nestjs/common'

import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { ResponseHandling, success } from '@/core/response-handling'

import { Notification } from '@/domain/notification/enterprise/entities/notification'

import { NotificationsRepository } from '../../repositories/notifications-repository'

export interface Input {
  recipientId: UniqueEntityID
  title: string
  content: string
}

export type Output = ResponseHandling<void, void>

@Injectable()
export class SendNotificationUseCase {
  constructor(
    private readonly notificationsRepository: NotificationsRepository,
  ) {}

  async execute({ recipientId, title, content }: Input): Promise<Output> {
    const notification = Notification.create({
      recipientId,
      title,
      content,
      read: false,
    })

    await this.notificationsRepository.sendNotification(notification)

    return success()
  }
}
