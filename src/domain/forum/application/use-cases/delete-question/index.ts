import { Injectable } from '@nestjs/common'

import { ResourceNotFoundError, NotAllowedError } from '@/core/errors'
import { ResponseHandling, success, fail } from '@/core/response-handling'

import { QuestionsRepository } from '../../repositories/questions-repository'

interface Input {
  id: string
  authorId: string
}

type Output = ResponseHandling<ResourceNotFoundError | NotAllowedError, void>

@Injectable()
export class DeleteQuestionUseCase {
  constructor(private readonly questionsRepository: QuestionsRepository) {}

  async execute({ id, authorId }: Input): Promise<Output> {
    const question = await this.questionsRepository.findById(id)

    if (!question) {
      return fail(new ResourceNotFoundError())
    }

    if (question.authorId.id !== authorId) {
      return fail(new NotAllowedError())
    }

    await this.questionsRepository.deleteQuestion(id)

    return success()
  }
}
