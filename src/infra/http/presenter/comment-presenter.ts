import {
  Comment,
  CommentProps,
} from '@/domain/forum/enterprise/entities/comment'
import { CommentWithAuthor } from '@/domain/forum/enterprise/entities/value-objects/comment-with-author'

export interface ICommentPresenter {
  id: string
  authorId: string
  content: string
  createdAt: Date
  updatedAt: Date | undefined
}

export interface ICommentWithAuthorPresenter {
  id: string
  content: string
  author: {
    id: string
    name: string
  }
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
      updatedAt: comment.updatedAt || undefined,
    }
  }

  static toHTTPWithAuthor(
    commentWithAuthor: CommentWithAuthor,
  ): ICommentWithAuthorPresenter {
    const { author, comment } = commentWithAuthor.props

    return {
      id: comment.id,
      content: comment.content,
      author: {
        id: author.id,
        name: author.name,
      },
      createdAt: comment.createdAt,
      updatedAt: comment.updatedAt || undefined,
    }
  }
}
