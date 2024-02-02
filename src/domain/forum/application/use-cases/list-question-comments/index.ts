import { Injectable } from '@nestjs/common'

import { ResponseHandling, fail, success } from '@/core/response-handling'

import { PaginationParams } from '@/core/repositories/pagination-params'

import { QuestionComment } from '@/domain/forum/enterprise/entities/question-comment'

import { QuestionsRepository } from '../../repositories/questions-repository'
import { QuestionsCommentsRepository } from '../../repositories/questions-comments-repository'

import { ResourceNotFoundError } from '@/core/errors'

interface Input {
  questionId: string
  paginationParams: PaginationParams
}

type Output = ResponseHandling<ResourceNotFoundError, QuestionComment[]>

@Injectable()
export class ListQuestionCommentsUseCase {
  constructor(
    private questionsRepository: QuestionsRepository,
    private readonly questionCommentRepository: QuestionsCommentsRepository,
  ) {}

  async execute({ questionId, paginationParams }: Input): Promise<Output> {
    const { page = 1, perPage = 10 } = paginationParams

    const question = await this.questionsRepository.findById(questionId)
    if (!question) return fail(new ResourceNotFoundError())

    const questionComments = await this.questionCommentRepository.findAll({
      questionId,
      page,
      perPage,
    })

    return success(questionComments)
  }
}
