import { PaginationParams } from '@/core/repositories/pagination-params'

import { Question } from '../../enterprise/entities/question'

export interface QuestionsRepository {
  createQuestion(question: Question): Promise<Question>

  findBySlug(slug: string): Promise<Question | undefined>

  findById(id: string): Promise<Question | undefined>

  deleteQuestion(id: string): Promise<void>

  editQuestion(question: Question): Promise<void>

  listRecentQuestions(params: PaginationParams): Promise<Question[]>
}
