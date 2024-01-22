import { Body, Controller, HttpCode, Param, Put } from '@nestjs/common'

import { UserPayload } from '@/infra/auth/jwt.strategy'
import { CurrentUser } from '@/infra/auth/current-user.decorator'

import {
  EditQuestionSchema,
  EditQuestionDTO,
} from '@/infra/http/dtos/edit-question.dto'
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipe'

import { EditQuestionUseCase } from '@/domain/forum/application/use-cases/edit-question'

@Controller('/questions/:id')
export class EditQuestionController {
  constructor(private readonly editQuestionUseCase: EditQuestionUseCase) {}

  @Put()
  @HttpCode(204)
  async handle(
    @CurrentUser() user: UserPayload,

    @Param('id') id: string,

    @Body(new ZodValidationPipe(EditQuestionSchema))
    data: EditQuestionDTO,
  ) {
    return await this.editQuestionUseCase.execute({
      id,
      title: data.title,
      content: data.content,
      authorId: user.sub,
      attachmentsIds: data.attachmentsIds,
    })
  }
}
