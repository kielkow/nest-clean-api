import { AggregateRoot } from '@/core/entities/aggregate-root'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'

export interface AttachmentProps {
  title: string
  type: string
  size: number
  url: string
}

export class Attachment extends AggregateRoot<AttachmentProps> {
  get title(): string {
    return this.props.title
  }

  get type(): string {
    return this.props.type
  }

  get size(): number {
    return this.props.size
  }

  get url(): string {
    return this.props.url
  }

  public static create(
    props: AttachmentProps,
    id?: UniqueEntityID,
    createdAt?: Date,
    updatedAt?: Date,
  ): Attachment {
    const attachment = new Attachment(props, id, createdAt, updatedAt)
    return attachment
  }
}
