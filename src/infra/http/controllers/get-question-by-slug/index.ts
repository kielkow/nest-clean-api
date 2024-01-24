import { Controller, Get, Param } from '@nestjs/common'

import { Fail } from '@/core/response-handling'
import { ResourceNotFoundError } from '@/core/errors'

import { FindQuestionBySlugUseCase } from '@/domain/forum/application/use-cases/find-question-by-slug'

import { QuestionPresenter } from '../../presenter/question-presenter'
import { httpErrorsTreatment } from '../../errors/http-treatment'

@Controller('/questions/:slug')
export class FindQuestionBySlugController {
  constructor(
    private readonly findQuestionBySlugUseCase: FindQuestionBySlugUseCase,
  ) {}

  @Get()
  async handle(@Param('slug') slug: string) {
    const result = await this.findQuestionBySlugUseCase.execute({ slug })

    const value = result.getValue()

    if (Fail.is(result) || value instanceof ResourceNotFoundError || !value) {
      return httpErrorsTreatment(result)
    }

    return QuestionPresenter.toHTTP(value)
  }
}
