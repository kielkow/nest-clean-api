import { Body, Controller, HttpCode, Param, Put } from '@nestjs/common'

import { Fail } from '@/core/response-handling'

import { UserPayload } from '@/infra/auth/jwt.strategy'
import { CurrentUser } from '@/infra/auth/current-user.decorator'

import {
  EditQuestionSchema,
  EditQuestionDTO,
} from '@/infra/http/dtos/edit-question.dto'
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipe'

import { EditQuestionUseCase } from '@/domain/forum/application/use-cases/edit-question'

import { httpErrorsTreatment } from '../../errors/http-treatment'

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
    const result = await this.editQuestionUseCase.execute({
      id,
      title: data.title,
      content: data.content,
      authorId: user.sub,
      attachmentsIds: data.attachmentsIds,
    })

    if (Fail.is(result)) {
      httpErrorsTreatment(result)
    }
  }
}
