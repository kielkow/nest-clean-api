import { Body, Controller, HttpCode, Post } from '@nestjs/common'

import { UserPayload } from '@/infra/auth/jwt.strategy'

import { CurrentUser } from '@/infra/auth/current-user.decorator'

import {
  CreateQuestionSchema,
  CreateQuestionDTO,
} from '@/infra/http/dtos/create-question.dto'

import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipe'

import { CreateQuestionUseCase } from '@/domain/forum/application/use-cases/create-question'

@Controller('/questions')
export class CreateQuestionController {
  constructor(private readonly createQuestionUseCase: CreateQuestionUseCase) {}

  @Post()
  @HttpCode(201)
  async handle(
    @CurrentUser() user: UserPayload,

    @Body(new ZodValidationPipe(CreateQuestionSchema))
    data: CreateQuestionDTO,
  ) {
    console.log('ATTACHMENTS IDS CONTROLLER', data.attachmentsIds)

    return await this.createQuestionUseCase.execute({
      title: data.title,
      content: data.content,
      authorId: user.sub,
      attachmentsIds: data.attachmentsIds,
    })
  }
}
