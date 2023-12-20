import { Injectable } from '@nestjs/common'

import { AnswerComment } from '@/domain/forum/enterprise/entities/answer-comment'
import { AnswersCommentsRepository } from '@/domain/forum/application/repositories/answers-comments-repository'

@Injectable()
export class PrismaAnswerCommentsRepository
  implements AnswersCommentsRepository
{
  create(answerComment: AnswerComment): Promise<AnswerComment> {
    throw new Error('Method not implemented.')
  }

  findById(id: string): Promise<AnswerComment | undefined> {
    throw new Error('Method not implemented.')
  }

  findAll(params: {
    answerId: string
    page: number
    perPage: number
  }): Promise<AnswerComment[]> {
    throw new Error('Method not implemented.')
  }

  delete(id: string): Promise<void> {
    throw new Error('Method not implemented.')
  }
}
