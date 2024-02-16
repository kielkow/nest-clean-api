import { ValueObject } from '@/core/entities/value-object'

export interface CommentWithAuthorProps {
  author: {
    id: string
    name: string
  }
  comment: {
    id: string
    content: string
    createdAt: Date
    updatedAt?: Date | null
  }
}

export class CommentWithAuthor extends ValueObject<CommentWithAuthorProps> {
  public props: CommentWithAuthorProps

  private constructor(props: CommentWithAuthorProps) {
    super(props)
    this.props = props
  }

  static create(props: CommentWithAuthorProps) {
    return new CommentWithAuthor(props)
  }
}
