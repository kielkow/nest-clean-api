import { Notification } from '../../enterprise/entities/notification'

export abstract class NotificationsRepository {
  abstract markAsRead(id: string): Promise<void>

  abstract sendNotification(notification: Notification): Promise<void>

  abstract findById(id: string): Promise<Notification | undefined>

  abstract findByRecipientId(recipientId: string): Promise<Notification[]>
}
