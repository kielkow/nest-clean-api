import { faker } from '@faker-js/faker'

import { Injectable } from '@nestjs/common'

import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import {
  AnswerComment,
  AnswerCommentProps,
} from '@/domain/forum/enterprise/entities/answer-comment'

import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { PrismaAnswerCommentMapper } from '@/infra/database/prisma/mappers/prisma-answer-comment-mapper'

export function makeAnswerComment(
  props: Partial<AnswerCommentProps> = {},
  id?: UniqueEntityID,
): AnswerComment {
  return AnswerComment.create(
    {
      authorId: new UniqueEntityID(),
      answerId: new UniqueEntityID(),
      content: faker.lorem.text(),
      ...props,
    },
    id,
  )
}

@Injectable()
export class AnswerCommentFactory {
  constructor(private prisma: PrismaService) {}

  async makePrismaAnswerComment(
    props: Partial<AnswerCommentProps> = {},
    id?: UniqueEntityID,
  ): Promise<AnswerComment> {
    const answerComment = makeAnswerComment(props, id)

    await this.prisma.comment.create({
      data: PrismaAnswerCommentMapper.toPersistence(answerComment),
    })

    return answerComment
  }
}
