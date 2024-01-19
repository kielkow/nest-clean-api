import {
  BadRequestException,
  ConflictException,
  Controller,
  Get,
  Param,
} from '@nestjs/common'

import { Fail } from '@/core/response-handling'
import { ResourceNotFoundError } from '@/core/errors'

import { FindQuestionBySlugUseCase } from '@/domain/forum/application/use-cases/find-question-by-slug'

import { QuestionPresenter } from '../../presenter/question-presenter'

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
      const error = value

      switch (error?.constructor) {
        case ResourceNotFoundError:
          throw new ConflictException(error)
        default:
          throw new BadRequestException(error)
      }
    }

    const question = value

    return QuestionPresenter.toHTTP(question)
  }
}
