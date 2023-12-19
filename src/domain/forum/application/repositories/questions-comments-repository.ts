import { QuestionComment } from '../../enterprise/entities/question-comment'

export interface QuestionsCommentsRepository {
  create(questionComment: QuestionComment): Promise<QuestionComment>

  findById(id: string): Promise<QuestionComment | undefined>

  findAll(params: {
    questionId: string
    page: number
    perPage: number
  }): Promise<QuestionComment[]>

  delete(id: string): Promise<void>
}
