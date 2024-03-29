import { Controller, Get, Query } from '@nestjs/common'

import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipe'

import {
  ListQuestionsDTO,
  ListQuestionsSchema,
} from '@/infra/http/dtos/list-questions.dto'

import { ListRecentQuestionsUseCase } from '@/domain/forum/application/use-cases/list-recent-questions'

import { QuestionPresenter } from '../../presenter/question-presenter'

@Controller('/questions')
export class ListQuestionsController {
  constructor(
    private readonly listRecentQuestions: ListRecentQuestionsUseCase,
  ) {}

  @Get()
  async handle(
    @Query(new ZodValidationPipe(ListQuestionsSchema)) params: ListQuestionsDTO,
  ) {
    const perPage = 10
    const page = params.page ? Number(params.page) : 1

    const paginationParams = {
      page,
      perPage,
    }

    const result = await this.listRecentQuestions.execute({
      paginationParams,
    })

    const questions = result.getValue()

    return questions ? questions.map(QuestionPresenter.toHTTP) : []
  }
}
