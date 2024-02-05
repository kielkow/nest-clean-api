import { Entity } from '@/core/entities/entity'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'

interface AttachmentProps {
  title: string
  type: string
  size: number
  url: string
}

export class Attachment extends Entity<AttachmentProps> {
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

  private constructor(props: AttachmentProps, id?: UniqueEntityID) {
    super(props, id)
  }

  public static create(
    props: AttachmentProps,
    id?: UniqueEntityID,
  ): Attachment {
    const attachment = new Attachment(props, id)
    return attachment
  }
}
