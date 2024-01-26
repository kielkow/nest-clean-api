import { Controller, Get, Param, Query } from '@nestjs/common'

import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipe'

import {
  ListQuestionAnswerDTO,
  ListQuestionAnswersSchema,
} from '../../dtos/list-question-answers.dto'

import { ListQuestionAnswersUseCase } from '@/domain/forum/application/use-cases/list-question-answers'

import { AnswerPresenter } from '../../presenter/answer-presenter'

@Controller('/questions/:id/answers')
export class ListQuestionAnswersController {
  constructor(
    private readonly listQuestionAnswersUseCase: ListQuestionAnswersUseCase,
  ) {}

  @Get()
  async handle(
    @Param('id') id: string,
    @Query(new ZodValidationPipe(ListQuestionAnswersSchema))
    params: ListQuestionAnswerDTO,
  ) {
    const perPage = 10
    const page = params.page ? Number(params.page) : 1

    const paginationParams = {
      page,
      perPage,
    }

    const result = await this.listQuestionAnswersUseCase.execute({
      questionId: id,
      paginationParams,
    })

    const answers = result.getValue()

    return answers ? answers.map(AnswerPresenter.toHTTP) : []
  }
}
