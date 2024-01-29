import { faker } from '@faker-js/faker'
import { Injectable } from '@nestjs/common'

import {
  Question,
  QuestionProps,
} from '@/domain/forum/enterprise/entities/question'

import { UniqueEntityID } from '@/core/entities/unique-entity-id'

import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { PrismaQuestionMapper } from '@/infra/database/prisma/mappers/prisma-question-mapper'

export function makeQuestion(
  props: Partial<QuestionProps> = {},
  id?: UniqueEntityID,
  createdAt?: Date,
): Question {
  return Question.create(
    {
      title: props.title || faker.lorem.sentence(),
      content: props.content || faker.lorem.text(),
      authorId: props.authorId || new UniqueEntityID(),
      ...props,
    },
    id,
    createdAt,
  )
}

@Injectable()
export class QuestionFactory {
  constructor(private prisma: PrismaService) {}

  async makePrismaQuestion(
    props: Partial<QuestionProps> = {},
    id?: UniqueEntityID,
  ): Promise<Question> {
    const question = makeQuestion(props, id)

    await this.prisma.question.create({
      data: PrismaQuestionMapper.toPersistence(question),
    })

    return question
  }
}
