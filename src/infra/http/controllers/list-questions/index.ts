import { Controller, Get, Query, UseGuards } from '@nestjs/common'

import { JwtAuthGuard } from '@/infra/auth/jwt-auth.guard'
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipe'

import {
  ListQuestionsDTO,
  ListQuestionsSchema,
} from '@/infra/http/dtos/list-questions.dto'

import { ListRecentQuestionsUseCase } from '@/domain/forum/application/use-cases/list-recent-questions'

@Controller('/questions')
@UseGuards(JwtAuthGuard)
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

    const questions = await this.listRecentQuestions.execute({
      paginationParams,
    })

    return questions
  }
}
