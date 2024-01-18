import { UniqueEntityID } from '@/core/entities/unique-entity-id'

import { Comment, CommentProps } from './comment'

export interface AnswerCommentProps extends CommentProps {
  answerId: UniqueEntityID
}

export class AnswerComment extends Comment<AnswerCommentProps> {
  get answerId() {
    return this.props.answerId
  }

  static create(
    props: AnswerCommentProps,
    id?: UniqueEntityID,
    createdAt?: Date,
    updatedAt?: Date,
  ) {
    const answerComment = new AnswerComment(props, id, createdAt, updatedAt)
    return answerComment
  }
}
