import { Entity } from '@/core/entities/entity'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'

interface AttachmentProps {
  title: string
  path: string
  type: string
  size: number
  link: string
}

export class Attachment extends Entity<AttachmentProps> {
  get title(): string {
    return this.props.title
  }

  get path(): string {
    return this.props.path
  }

  get type(): string {
    return this.props.type
  }

  get size(): number {
    return this.props.size
  }

  get link(): string {
    return this.props.link
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
