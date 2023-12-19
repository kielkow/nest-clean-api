import { ResponseHandling, success } from '@/core/response-handling'
import { PaginationParams } from '@/core/repositories/pagination-params'

import { Answer } from '@/domain/forum/enterprise/entities/answer'

import { AnswersRepository } from '../../repositories/answers-repository'

interface Input {
  questionId: string
  paginationParams: PaginationParams
}

type Output = ResponseHandling<void, Answer[]>

export class ListQuestionAnswersUseCase {
  constructor(private readonly answersRepository: AnswersRepository) {}

  async execute({ questionId, paginationParams }: Input): Promise<Output> {
    const { page = 1, perPage = 10 } = paginationParams

    const answers = await this.answersRepository.listQuetionAnswers({
      questionId,
      page,
      perPage,
    })

    return success(answers)
  }
}
