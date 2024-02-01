import {
  Comment,
  CommentProps,
} from '@/domain/forum/enterprise/entities/comment'

export interface ICommentPresenter {
  id: string

  authorId: string
  content: string

  createdAt: Date
  updatedAt: Date | undefined
}

export class CommentPresenter {
  static toHTTP(comment: Comment<CommentProps>): ICommentPresenter {
    return {
      id: comment.id,

      authorId: comment.authorId.id,
      content: comment.content,

      createdAt: comment.createdAt,
      updatedAt: comment.updatedAt,
    }
  }
}
