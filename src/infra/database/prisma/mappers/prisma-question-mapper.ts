import { Question as PrismaQuestion } from '@prisma/client'

import { UniqueEntityID } from '@/core/entities/unique-entity-id'

import { Question } from '@/domain/forum/enterprise/entities/question'
import { Slug } from '@/domain/forum/enterprise/entities/value-objects/slug'

export class PrismaQuestionMapper {
  static toDomain(prismaQuestion: PrismaQuestion) {
    const {
      id,
      title,
      content,
      authorId,
      bestAnswerId,
      slug,
      createdAt,
      updatedAt,
    } = prismaQuestion

    const domainId = new UniqueEntityID(id)
    const domainAuthorId = new UniqueEntityID(authorId)
    const domainBestAnswerId = bestAnswerId
      ? new UniqueEntityID(bestAnswerId)
      : undefined

    const domainSlug = Slug.create(slug)

    return Question.create(
      {
        title,
        content,
        slug: domainSlug,
        authorId: domainAuthorId,
        bestAnswerId: domainBestAnswerId,
      },
      domainId,
      createdAt,
      updatedAt,
    )
  }
}
