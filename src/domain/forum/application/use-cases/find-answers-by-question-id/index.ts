import { ResponseHandling, success } from '@/core/response-handling'

import { Answer } from '@/domain/forum/enterprise/entities/answer'

import { AnswersRepository } from '../../repositories/answers-repository'

type Output = ResponseHandling<void, Answer[]>

export class FindAnswersByQuestionIDUseCase {
  constructor(private readonly answersRepository: AnswersRepository) {}

  async execute(questionId: string): Promise<Output> {
    const result = await this.answersRepository.findByQuestionID(questionId)

    return success(result)
  }
}
