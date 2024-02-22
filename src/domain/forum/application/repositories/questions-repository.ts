import { PaginationParams } from '@/core/repositories/pagination-params'

import { Question } from '../../enterprise/entities/question'
import { QuestionDetails } from '../../enterprise/entities/value-objects/question-details'

export abstract class QuestionsRepository {
  abstract createQuestion(question: Question): Promise<Question>

  abstract findBySlug(slug: string): Promise<Question | undefined>

  abstract findBySlugWithDetails(
    slug: string,
  ): Promise<QuestionDetails | undefined>

  abstract findById(id: string): Promise<Question | undefined>

  abstract deleteQuestion(id: string): Promise<void>

  abstract editQuestion(question: Question): Promise<void>

  abstract listRecentQuestions(params: PaginationParams): Promise<Question[]>
}
