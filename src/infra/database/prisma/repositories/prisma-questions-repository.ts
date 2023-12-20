import { Injectable } from '@nestjs/common'

import { Question } from '@/domain/forum/enterprise/entities/question'
import { PaginationParams } from '@/core/repositories/pagination-params'
import { QuestionsRepository } from '@/domain/forum/application/repositories/questions-repository'

@Injectable()
export class PrismaQuestionsRepository implements QuestionsRepository {
  createQuestion(question: Question): Promise<Question> {
    throw new Error('Method not implemented.')
  }

  findBySlug(slug: string): Promise<Question | undefined> {
    throw new Error('Method not implemented.')
  }

  findById(id: string): Promise<Question | undefined> {
    throw new Error('Method not implemented.')
  }

  deleteQuestion(id: string): Promise<void> {
    throw new Error('Method not implemented.')
  }

  editQuestion(question: Question): Promise<void> {
    throw new Error('Method not implemented.')
  }

  listRecentQuestions(params: PaginationParams): Promise<Question[]> {
    throw new Error('Method not implemented.')
  }
}
