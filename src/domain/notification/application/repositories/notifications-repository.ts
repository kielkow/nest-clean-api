import { Notification } from '../../enterprise/entities/notification'

export interface NotificationsRepository {
  markAsRead(id: string): Promise<void>

  sendNotification(notification: Notification): Promise<void>

  findById(id: string): Promise<Notification | undefined>

  findByRecipientId(recipientId: string): Promise<Notification[]>
}
