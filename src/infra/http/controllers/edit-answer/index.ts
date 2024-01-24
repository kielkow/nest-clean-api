import { Body, Controller, HttpCode, Param, Put } from '@nestjs/common'

import { UserPayload } from '@/infra/auth/jwt.strategy'
import { CurrentUser } from '@/infra/auth/current-user.decorator'

import {
  EditAnswerSchema,
  EditAnswerDTO,
} from '@/infra/http/dtos/edit-answer.dto'
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipe'

import { EditAnswerUseCase } from '@/domain/forum/application/use-cases/edit-answer'

@Controller('/answers/:id')
export class EditAnswerController {
  constructor(private readonly editAnswerUseCase: EditAnswerUseCase) {}

  @Put()
  @HttpCode(204)
  async handle(
    @CurrentUser() user: UserPayload,

    @Param('id') id: string,

    @Body(new ZodValidationPipe(EditAnswerSchema))
    data: EditAnswerDTO,
  ) {
    await this.editAnswerUseCase.execute({
      id,
      content: data.content,
      authorId: user.sub,
      attachmentsIds: data.attachmentsIds,
    })
  }
}
