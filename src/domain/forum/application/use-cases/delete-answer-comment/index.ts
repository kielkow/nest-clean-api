import { ResponseHandling, fail, success } from '@/core/response-handling'
import { AnswersCommentsRepository } from '../../repositories/answers-comments-repository'
import { NotAllowedError, ResourceNotFoundError } from '@/core/errors'

interface Input {
  id: string
  authorId: string
}

type Output = ResponseHandling<ResourceNotFoundError | NotAllowedError, void>

export class DeleteAnswerCommentUseCase {
  constructor(
    private readonly answerCommentRepository: AnswersCommentsRepository,
  ) {}

  async execute({ id, authorId }: Input): Promise<Output> {
    const answerComment = await this.answerCommentRepository.findById(id)

    if (!answerComment) return fail(new ResourceNotFoundError())

    if (answerComment.authorId.id !== authorId) {
      return fail(new NotAllowedError())
    }

    await this.answerCommentRepository.delete(id)

    return success()
  }
}
