import { Body, Controller, HttpCode, Post } from '@nestjs/common'

import { UserPayload } from '@/infra/auth/jwt.strategy'

import { CurrentUser } from '@/infra/auth/current-user.decorator'

import {
  AnswerQuestionSchema,
  AnswerQuestionDTO,
} from '@/infra/http/dtos/answer-question.dto'

import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipe'

import { AnswerQuestionUseCase } from '@/domain/forum/application/use-cases/answer-question'

@Controller('/answers')
export class AnswerQuestionController {
  constructor(private readonly answerQuestionUseCase: AnswerQuestionUseCase) {}

  @Post()
  @HttpCode(201)
  async handle(
    @CurrentUser() user: UserPayload,

    @Body(new ZodValidationPipe(AnswerQuestionSchema))
    data: AnswerQuestionDTO,
  ) {
    return await this.answerQuestionUseCase.execute({
      authorId: user.sub,
      questionId: data.questionId,
      content: data.content,
      attachmentsIds: data.attachmentsIds,
    })
  }
}
