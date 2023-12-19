import { Notification } from '@/domain/notification/enterprise/entities/notification'
import { NotificationsRepository } from '@/domain/notification/application/repositories/notifications-repository'

export class InMemoryNotificationsRepository
  implements NotificationsRepository
{
  private notifications: Notification[] = []

  async sendNotification(notification: Notification): Promise<void> {
    this.notifications.push(notification)
  }

  async findById(id: string): Promise<Notification | undefined> {
    return this.notifications.find((notification) => notification.id === id)
  }

  async findByRecipientId(recipientId: string): Promise<Notification[]> {
    return this.notifications.filter(
      (notification) => notification.recipientId.id === recipientId,
    )
  }

  async markAsRead(id: string): Promise<void> {
    const notification = await this.findById(id)

    if (!notification) return

    notification.read = true
  }
}
