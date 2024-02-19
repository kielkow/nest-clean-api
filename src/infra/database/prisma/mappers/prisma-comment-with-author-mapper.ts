import { Comment, User } from '@prisma/client'

import { CommentWithAuthor } from '@/domain/forum/enterprise/entities/value-objects/comment-with-author'

type PrismaCommentWithAuthor = Comment & { author: User }

export class PrismaCommentWithAuthorMapper {
  static toDomain(prismaComment: PrismaCommentWithAuthor): CommentWithAuthor {
    return CommentWithAuthor.create({
      author: {
        id: prismaComment.author.id,
        name: prismaComment.author.name,
      },
      comment: {
        id: prismaComment.id,
        content: prismaComment.content,
        createdAt: prismaComment.createdAt,
        updatedAt: prismaComment.updatedAt,
      },
    })
  }
}
