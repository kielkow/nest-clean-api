import { Body, Controller, HttpCode, Post, UseGuards } from '@nestjs/common'

import { JwtAuthGuard } from '@/infra/auth/jwt-auth.guard'
import { UserPayload } from '@/infra/auth/jwt.strategy'

import { CurrentUser } from '@/infra/auth/current-user.decorator'

import {
  CreateQuestionSchema,
  CreateQuestionDTO,
} from '@/infra/http/dtos/create-question.dto'

import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipe'

import { CreateQuestionUseCase } from '@/domain/forum/application/use-cases/create-question'

@Controller('/questions')
@UseGuards(JwtAuthGuard)
export class CreateQuestionController {
  constructor(private readonly createQuestionUseCase: CreateQuestionUseCase) {}

  @Post()
  @HttpCode(201)
  async handle(
    @CurrentUser() user: UserPayload,

    @Body(new ZodValidationPipe(CreateQuestionSchema))
    data: CreateQuestionDTO,
  ) {
    return await this.createQuestionUseCase.execute({
      title: data.title,
      content: data.content,
      authorId: user.sub,
      attachmentsIds: data.attachmentsIds,
    })
  }
}
