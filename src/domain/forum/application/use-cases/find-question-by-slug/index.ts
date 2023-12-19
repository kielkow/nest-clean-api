import { ResponseHandling, success, fail } from '@/core/response-handling'

import { Question } from '@/domain/forum/enterprise/entities/question'

import { QuestionsRepository } from '../../repositories/questions-repository'

import { ResourceNotFoundError } from '@/core/errors'

interface Input {
  slug: string
}

type Output = ResponseHandling<ResourceNotFoundError, Question>

export class FindQuestionBySlugUseCase {
  constructor(private readonly questionsRepository: QuestionsRepository) {}

  async execute({ slug }: Input): Promise<Output> {
    const question = await this.questionsRepository.findBySlug(slug)

    if (!question) {
      return fail(new ResourceNotFoundError())
    }

    return success(question)
  }
}
