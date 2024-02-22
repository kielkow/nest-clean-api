import { Question } from '@/domain/forum/enterprise/entities/question'
import { QuestionDetails } from '@/domain/forum/enterprise/entities/value-objects/question-details'

export interface IQuestionPresenter {
  id: string
  authorId: string

  slug: string
  title: string
  content: string

  bestAnswerId: string | null

  createdAt: Date
  updatedAt: Date | undefined
}

export interface IQuestionDetailsPresenter {
  id: string
  title: string
  slug: string
  content: string
  bestAnswerId?: string

  author: {
    id: string
    name: string
  }

  attachments: {
    id: string
    title: string
    type: string
    size: number
    url: string
  }[]

  createdAt: Date
  updatedAt?: Date
}

export class QuestionPresenter {
  static toHTTP(question: Question): IQuestionPresenter {
    return {
      id: question.id,
      authorId: question.authorId.id,

      slug: question.slug.value,
      title: question.title,
      content: question.content,

      bestAnswerId: question.bestAnswerId?.id ?? null,

      createdAt: question.createdAt,
      updatedAt: question.updatedAt,
    }
  }

  static toHTTPWithDetails(
    questionDetails: QuestionDetails,
  ): IQuestionDetailsPresenter {
    const { props } = questionDetails

    return {
      id: props.id.id,
      title: props.title,
      slug: props.slug.value,
      content: props.content,
      bestAnswerId: props.bestAnswerId?.id,

      author: {
        id: props.author.id.id,
        name: props.author.name,
      },

      attachments: props.attachments.map((attachment) => ({
        id: attachment.id,
        title: attachment.title,
        type: attachment.type,
        size: attachment.size,
        url: attachment.url,
      })),

      createdAt: props.createdAt,
      updatedAt: props.updatedAt,
    }
  }
}
