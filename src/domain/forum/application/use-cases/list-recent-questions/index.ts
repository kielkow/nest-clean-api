import { Injectable } from '@nestjs/common'

import { ResponseHandling, success } from '@/core/response-handling'
import { PaginationParams } from '@/core/repositories/pagination-params'

import { Question } from '@/domain/forum/enterprise/entities/question'

import { QuestionsRepository } from '../../repositories/questions-repository'

interface Input {
  paginationParams: PaginationParams
}

type Output = ResponseHandling<void, Question[]>

@Injectable()
export class ListRecentQuestionsUseCase {
  constructor(private readonly questionsRepository: QuestionsRepository) {}

  async execute({ paginationParams }: Input): Promise<Output> {
    const { page = 1, perPage = 10 } = paginationParams

    const questions = await this.questionsRepository.listRecentQuestions({
      page,
      perPage,
    })

    return success(questions)
  }
}
