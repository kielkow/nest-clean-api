import { Entity } from '@/core/entities/entity'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'

interface AnswerAttachmentProps {
  answerId: UniqueEntityID
  attachmentId: UniqueEntityID
}

export class AnswerAttachment extends Entity<AnswerAttachmentProps> {
  get answerId(): UniqueEntityID {
    return this.props.answerId
  }

  get attachmentId(): UniqueEntityID {
    return this.props.attachmentId
  }

  public static create(
    props: AnswerAttachmentProps,
    id?: UniqueEntityID,
    createdAt?: Date,
    updatedAt?: Date,
  ): AnswerAttachment {
    const answerAttachment = new AnswerAttachment(
      props,
      id,
      createdAt,
      updatedAt,
    )
    return answerAttachment
  }
}
