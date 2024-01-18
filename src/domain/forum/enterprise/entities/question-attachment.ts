import { Entity } from '@/core/entities/entity'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'

interface QuestionAttachmentProps {
  questionId: UniqueEntityID
  attachmentId: UniqueEntityID
}

export class QuestionAttachment extends Entity<QuestionAttachmentProps> {
  get questionId(): UniqueEntityID {
    return this.props.questionId
  }

  get attachmentId(): UniqueEntityID {
    return this.props.attachmentId
  }

  public static create(
    props: QuestionAttachmentProps,
    id?: UniqueEntityID,
    createdAt?: Date,
    updatedAt?: Date,
  ): QuestionAttachment {
    const questionAttachment = new QuestionAttachment(
      props,
      id,
      createdAt,
      updatedAt,
    )
    return questionAttachment
  }
}
