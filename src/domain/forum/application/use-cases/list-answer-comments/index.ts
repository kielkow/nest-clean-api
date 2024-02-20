import { Injectable } from '@nestjs/common'

import { ResourceNotFoundError } from '@/core/errors'
import { PaginationParams } from '@/core/repositories/pagination-params'
import { ResponseHandling, success, fail } from '@/core/response-handling'

import { CommentWithAuthor } from '@/domain/forum/enterprise/entities/value-objects/comment-with-author'

import { AnswersRepository } from '../../repositories/answers-repository'
import { AnswersCommentsRepository } from '../../repositories/answers-comments-repository'

interface Input {
  answerId: string
  paginationParams: PaginationParams
}

type Output = ResponseHandling<ResourceNotFoundError, CommentWithAuthor[]>

@Injectable()
export class ListAnswerCommentsUseCase {
  constructor(
    private answersRepository: AnswersRepository,
    private readonly answerCommentRepository: AnswersCommentsRepository,
  ) {}

  async execute({ answerId, paginationParams }: Input): Promise<Output> {
    const { page = 1, perPage = 10 } = paginationParams

    const answer = await this.answersRepository.findById(answerId)
    if (!answer) return fail(new ResourceNotFoundError())

    const answerComments =
      await this.answerCommentRepository.findManyByAnswerIdWithAuthor({
        answerId,
        page,
        perPage,
      })

    return success(answerComments)
  }
}
