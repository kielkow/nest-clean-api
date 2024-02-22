import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { ValueObject } from '@/core/entities/value-object'

import { Slug } from '../slug'
import { Attachment } from '../../attachment'

export interface QuestionDetailsProps {
  id: UniqueEntityID
  title: string
  slug: Slug
  content: string
  bestAnswerId?: UniqueEntityID

  author: {
    id: UniqueEntityID
    name: string
  }

  attachments: Attachment[]

  createdAt: Date
  updatedAt?: Date
}

export class QuestionDetails extends ValueObject<QuestionDetailsProps> {
  public props: QuestionDetailsProps

  private constructor(props: QuestionDetailsProps) {
    super(props)
    this.props = props
  }

  static create(props: QuestionDetailsProps) {
    return new QuestionDetails(props)
  }
}
