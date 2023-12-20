import { Injectable } from '@nestjs/common'

import { QuestionComment } from '@/domain/forum/enterprise/entities/question-comment'
import { QuestionsCommentsRepository } from '@/domain/forum/application/repositories/questions-comments-repository'

@Injectable()
export class PrismaQuestionCommentsRepository
  implements QuestionsCommentsRepository
{
  create(questionComment: QuestionComment): Promise<QuestionComment> {
    throw new Error('Method not implemented.')
  }

  findById(id: string): Promise<QuestionComment | undefined> {
    throw new Error('Method not implemented.')
  }

  findAll(params: {
    questionId: string
    page: number
    perPage: number
  }): Promise<QuestionComment[]> {
    throw new Error('Method not implemented.')
  }

  delete(id: string): Promise<void> {
    throw new Error('Method not implemented.')
  }
}
