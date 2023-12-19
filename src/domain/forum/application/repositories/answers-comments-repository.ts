import { AnswerComment } from '../../enterprise/entities/answer-comment'

export interface AnswersCommentsRepository {
  create(answerComment: AnswerComment): Promise<AnswerComment>

  findById(id: string): Promise<AnswerComment | undefined>

  findAll(params: {
    answerId: string
    page: number
    perPage: number
  }): Promise<AnswerComment[]>

  delete(id: string): Promise<void>
}
