import { Question } from '@/domain/forum/enterprise/entities/question'

export interface IQuestionPresenter {
  id: string

  slug: string
  title: string
  content: string

  bestAnswerId: string | null

  createdAt: Date
  updatedAt: Date | undefined
}

export class QuestionPresenter {
  static toHTTP(question: Question): IQuestionPresenter {
    return {
      id: question.id,

      slug: question.slug.value,
      title: question.title,
      content: question.content,

      bestAnswerId: question.bestAnswerId?.id ?? null,

      createdAt: question.createdAt,
      updatedAt: question.updatedAt,
    }
  }
}
