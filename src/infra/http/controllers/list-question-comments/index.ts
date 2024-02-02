import { Controller, Get, Param, Query } from '@nestjs/common'

import { Fail } from '@/core/response-handling'
import { ResourceNotFoundError } from '@/core/errors'

import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipe'

import {
  ListCommentsDTO,
  ListCommentsSchema,
} from '../../dtos/list-comments.dto'

import { ListQuestionCommentsUseCase } from '@/domain/forum/application/use-cases/list-question-comments'

import { httpErrorsTreatment } from '../../errors/http-treatment'
import { CommentPresenter } from '../../presenter/comment-presenter'

@Controller('/questions/:id/comments')
export class ListQuestionCommentsController {
  constructor(
    private readonly listQuestionCommentsUseCase: ListQuestionCommentsUseCase,
  ) {}

  @Get()
  async handle(
    @Param('id') id: string,
    @Query(new ZodValidationPipe(ListCommentsSchema))
    params: ListCommentsDTO,
  ) {
    const perPage = 10
    const page = params.page ? Number(params.page) : 1

    const paginationParams = {
      page,
      perPage,
    }

    const result = await this.listQuestionCommentsUseCase.execute({
      questionId: id,
      paginationParams,
    })

    const value = result.getValue()

    if (Fail.is(result) || value instanceof ResourceNotFoundError || !value) {
      return httpErrorsTreatment(result)
    }

    return value.map(CommentPresenter.toHTTP)
  }
}
