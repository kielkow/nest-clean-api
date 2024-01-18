import { UniqueEntityID } from '@/core/entities/unique-entity-id'

import { Comment, CommentProps } from './comment'

export interface QuestionCommentProps extends CommentProps {
  questionId: UniqueEntityID
}

export class QuestionComment extends Comment<QuestionCommentProps> {
  get questionId() {
    return this.props.questionId
  }

  static create(
    props: QuestionCommentProps,
    id?: UniqueEntityID,
    createdAt?: Date,
    updatedAt?: Date,
  ) {
    const questionComment = new QuestionComment(props, id, createdAt, updatedAt)
    return questionComment
  }
}
