import { AnswerComment } from '../../enterprise/entities/answer-comment'

export abstract class AnswersCommentsRepository {
  abstract create(answerComment: AnswerComment): Promise<AnswerComment>

  abstract findById(id: string): Promise<AnswerComment | undefined>

  abstract findAll(params: {
    answerId: string
    page: number
    perPage: number
  }): Promise<AnswerComment[]>

  abstract delete(id: string): Promise<void>
}
