import { ResponseHandling, fail, success } from '@/core/response-handling'

import { NotAllowedError, ResourceNotFoundError } from '@/core/errors'

import { AnswersRepository } from '../../repositories/answers-repository'

interface Input {
  id: string
  authorId: string
}

type Output = ResponseHandling<ResourceNotFoundError | NotAllowedError, void>

export class DeleteAnswerUseCase {
  constructor(private readonly answersRepository: AnswersRepository) {}

  async execute({ id, authorId }: Input): Promise<Output> {
    const answer = await this.answersRepository.findById(id)

    if (!answer) return fail(new ResourceNotFoundError())

    if (answer.authorId.id !== authorId) {
      return fail(new NotAllowedError())
    }

    const result = await this.answersRepository.deleteAnswer(id)

    return success(result)
  }
}
