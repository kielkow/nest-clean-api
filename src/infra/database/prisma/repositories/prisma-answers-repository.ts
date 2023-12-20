import { Injectable } from '@nestjs/common'

import { Answer } from '@/domain/forum/enterprise/entities/answer'
import { AnswersRepository } from '@/domain/forum/application/repositories/answers-repository'

@Injectable()
export class PrismaAnswersRepository implements AnswersRepository {
  createAnswer(answer: Answer): Promise<Answer> {
    throw new Error('Method not implemented.')
  }

  findById(id: string): Promise<Answer | undefined> {
    throw new Error('Method not implemented.')
  }

  findByQuestionID(questionId: string): Promise<Answer[]> {
    throw new Error('Method not implemented.')
  }

  deleteAnswer(id: string): Promise<void> {
    throw new Error('Method not implemented.')
  }

  editAnswer(answer: Answer): Promise<void> {
    throw new Error('Method not implemented.')
  }

  listQuetionAnswers(params: {
    questionId: string
    page: number
    perPage: number
  }): Promise<Answer[]> {
    throw new Error('Method not implemented.')
  }
}
