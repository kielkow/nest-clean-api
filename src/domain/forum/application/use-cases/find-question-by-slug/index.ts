import { Injectable } from '@nestjs/common'

import { ResourceNotFoundError } from '@/core/errors'
import { ResponseHandling, success, fail } from '@/core/response-handling'

import { QuestionDetails } from '@/domain/forum/enterprise/entities/value-objects/question-details'

import { QuestionsRepository } from '../../repositories/questions-repository'

interface Input {
  slug: string
}

type Output = ResponseHandling<ResourceNotFoundError, QuestionDetails>

@Injectable()
export class FindQuestionBySlugUseCase {
  constructor(private readonly questionsRepository: QuestionsRepository) {}

  async execute({ slug }: Input): Promise<Output> {
    const questionDetails =
      await this.questionsRepository.findBySlugWithDetails(slug)

    if (!questionDetails) {
      return fail(new ResourceNotFoundError())
    }

    return success(questionDetails)
  }
}
