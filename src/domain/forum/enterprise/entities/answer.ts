import { Optional } from '@/core/types/optional'
import { AggregateRoot } from '@/core/entities/aggregate-root'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'

import { AnswerAttachmentList } from './answer-attachment-list'
import { AnswerCreatedEvent } from '../events/answer-created-event'

export interface AnswerProps {
  content: string
  questionId: UniqueEntityID
  authorId: UniqueEntityID
  attachments: AnswerAttachmentList
}

export class Answer extends AggregateRoot<AnswerProps> {
  get content() {
    return this.props.content
  }

  get questionId() {
    return this.props.questionId
  }

  get authorId() {
    return this.props.authorId
  }

  get attachments() {
    return this.props.attachments
  }

  get except() {
    return this.props.content.substring(0, 120).trimEnd().concat('...')
  }

  set content(value: string) {
    this.props.content = value
    this.touch()
  }

  set attachments(value: AnswerAttachmentList) {
    this.props.attachments = value
    this.touch()
  }

  private touch() {
    this.updatedAt = new Date()
  }

  static create(
    props: Optional<AnswerProps, 'attachments'>,
    id?: UniqueEntityID,
  ) {
    const answer = new Answer(
      {
        ...props,
        attachments: props.attachments ?? AnswerAttachmentList.create(),
      },
      id,
    )

    const isNew = !id
    isNew && answer.addDomainEvent(new AnswerCreatedEvent(answer))

    return answer
  }
}
