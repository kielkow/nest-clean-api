import { ResponseHandling, success, fail } from '@/core/response-handling'

import { ResourceNotFoundError, NotAllowedError } from '@/core/errors'

import { QuestionsCommentsRepository } from '../../repositories/questions-comments-repository'

interface Input {
  id: string
  authorId: string
}

type Output = ResponseHandling<ResourceNotFoundError | NotAllowedError, void>

export class DeleteQuestionCommentUseCase {
  constructor(
    private readonly questionCommentRepository: QuestionsCommentsRepository,
  ) {}

  async execute({ id, authorId }: Input): Promise<Output> {
    const questionComment = await this.questionCommentRepository.findById(id)

    if (!questionComment) {
      return fail(new ResourceNotFoundError())
    }

    if (questionComment.authorId.id !== authorId) {
      return fail(new NotAllowedError())
    }

    await this.questionCommentRepository.delete(id)

    return success()
  }
}
