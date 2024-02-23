import { Entity } from '@/core/entities/entity'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'

export interface NotificationProps {
  recipientId: UniqueEntityID
  title: string
  content: string
  read: boolean
  readAt?: Date
}

export class Notification extends Entity<NotificationProps> {
  get recipientId(): UniqueEntityID {
    return this.props.recipientId
  }

  get title(): string {
    return this.props.title
  }

  get content(): string {
    return this.props.content
  }

  get read(): boolean {
    return this.props.read
  }

  get readAt(): Date | undefined {
    return this.props.readAt
  }

  set read(read: boolean) {
    this.props.read = read

    if (read) {
      this.props.readAt = new Date()
    }

    this.touch()
  }

  private touch() {
    this.updatedAt = new Date()
  }

  public static create(
    props: NotificationProps,
    id?: UniqueEntityID,
    createdAt?: Date,
    updatedAt?: Date,
  ): Notification {
    const notification = new Notification(props, id, createdAt, updatedAt)
    return notification
  }
}
