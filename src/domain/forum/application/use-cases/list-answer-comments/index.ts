import { Injectable } from '@nestjs/common'

import { ResponseHandling, success, fail } from '@/core/response-handling'

import { PaginationParams } from '@/core/repositories/pagination-params'

import { AnswerComment } from '@/domain/forum/enterprise/entities/answer-comment'

import { AnswersRepository } from '../../repositories/answers-repository'
import { AnswersCommentsRepository } from '../../repositories/answers-comments-repository'

import { ResourceNotFoundError } from '@/core/errors'

interface Input {
  answerId: string
  paginationParams: PaginationParams
}

type Output = ResponseHandling<ResourceNotFoundError, AnswerComment[]>

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

    const answerComments = await this.answerCommentRepository.findAll({
      answerId,
      page,
      perPage,
    })

    return success(answerComments)
  }
}
