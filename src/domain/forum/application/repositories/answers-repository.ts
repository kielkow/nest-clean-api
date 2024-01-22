import { Answer } from '../../enterprise/entities/answer'

export abstract class AnswersRepository {
  abstract createAnswer(answer: Answer): Promise<Answer>

  abstract findById(id: string): Promise<Answer | undefined>

  abstract findByQuestionID(questionId: string): Promise<Answer[]>

  abstract deleteAnswer(id: string): Promise<void>

  abstract editAnswer(answer: Answer): Promise<void>

  abstract listQuetionAnswers(params: {
    questionId: string
    page: number
    perPage: number
  }): Promise<Answer[]>
}
