import { faker } from '@faker-js/faker'

import { Injectable } from '@nestjs/common'

import { UniqueEntityID } from '@/core/entities/unique-entity-id'

import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { PrismaAnswerMapper } from '@/infra/database/prisma/mappers/prisma-answer-mapper'

import { Answer, AnswerProps } from '@/domain/forum/enterprise/entities/answer'

export function makeAnswer(
  props: Partial<AnswerProps> = {},
  id?: UniqueEntityID,
): Answer {
  return Answer.create(
    {
      authorId: new UniqueEntityID(),
      questionId: new UniqueEntityID(),
      content: faker.lorem.text(),
      ...props,
    },
    id,
  )
}

@Injectable()
export class AnswerFactory {
  constructor(private prisma: PrismaService) {}

  async makePrismaAnswer(
    props: Partial<AnswerProps> = {},
    id?: UniqueEntityID,
  ): Promise<Answer> {
    const answer = makeAnswer(props, id)

    await this.prisma.answer.create({
      data: PrismaAnswerMapper.toPersistence(answer),
    })

    return answer
  }
}
