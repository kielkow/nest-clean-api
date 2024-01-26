import { Answer } from '@/domain/forum/enterprise/entities/answer'

export interface IAnswerPresenter {
  id: string

  authorId: string
  content: string

  createdAt: Date
  updatedAt: Date | undefined
}

export class AnswerPresenter {
  static toHTTP(answer: Answer): IAnswerPresenter {
    return {
      id: answer.id,

      authorId: answer.authorId.id,
      content: answer.content,

      createdAt: answer.createdAt,
      updatedAt: answer.updatedAt,
    }
  }
}
