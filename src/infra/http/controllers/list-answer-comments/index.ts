import { Controller, Get, Param, Query } from '@nestjs/common'

import { Fail } from '@/core/response-handling'
import { ResourceNotFoundError } from '@/core/errors'

import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipe'

import { ListAnswerCommentsUseCase } from '@/domain/forum/application/use-cases/list-answer-comments'

import {
  ListCommentsDTO,
  ListCommentsSchema,
} from '../../dtos/list-comments.dto'
import { httpErrorsTreatment } from '../../errors/http-treatment'
import { CommentPresenter } from '../../presenter/comment-presenter'

@Controller('/answers/:id/comments')
export class ListAnswerCommentsController {
  constructor(
    private readonly listAnswerCommentsUseCase: ListAnswerCommentsUseCase,
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

    const result = await this.listAnswerCommentsUseCase.execute({
      answerId: id,
      paginationParams,
    })

    const value = result.getValue()

    if (Fail.is(result) || value instanceof ResourceNotFoundError || !value) {
      return httpErrorsTreatment(result)
    }

    return value.map(CommentPresenter.toHTTPWithAuthor)
  }
}
