import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { QuestionDetails } from '.'
import { Slug } from '../slug'

test('create an question with details', async () => {
  const props = {
    id: new UniqueEntityID(),
    title: 'What it is my question?',
    slug: Slug.create('What it is my question?'),
    content: 'This is my question',
    bestAnswerId: new UniqueEntityID(),

    author: {
      id: new UniqueEntityID(),
      name: 'Jonh Doe',
    },

    attachments: [],

    createdAt: new Date(),
    updatedAt: undefined,
  }

  const questionDetails = QuestionDetails.create(props)

  expect(JSON.stringify(questionDetails.props)).toEqual(JSON.stringify(props))
})
