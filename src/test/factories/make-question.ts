import { faker } from '@faker-js/faker'

import {
  Question,
  QuestionProps,
} from '@/domain/forum/enterprise/entities/question'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'

export function makeQuestion(
  props: Partial<QuestionProps> = {},
  id?: UniqueEntityID,
  createdAt?: Date,
): Question {
  return Question.create(
    {
      title: faker.lorem.sentence(),
      content: faker.lorem.text(),
      authorId: new UniqueEntityID(),
      ...props,
    },
    id,
    createdAt,
  )
}
