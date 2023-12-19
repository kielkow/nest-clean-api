import { Answer } from '../../enterprise/entities/answer'

export interface AnswersRepository {
  createAnswer(answer: Answer): Promise<Answer>

  findById(id: string): Promise<Answer | undefined>

  findByQuestionID(questionId: string): Promise<Answer[]>

  deleteAnswer(id: string): Promise<void>

  editAnswer(answer: Answer): Promise<void>

  listQuetionAnswers(params: {
    questionId: string
    page: number
    perPage: number
  }): Promise<Answer[]>
}
