import {
  BadRequestException,
  Body,
  ConflictException,
  Controller,
  HttpCode,
  Param,
  Put,
  UnauthorizedException,
} from '@nestjs/common'

import { Fail } from '@/core/response-handling'
import { NotAllowedError, ResourceNotFoundError } from '@/core/errors'

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
    const result = await this.editAnswerUseCase.execute({
      id,
      content: data.content,
      authorId: user.sub,
      attachmentsIds: data.attachmentsIds,
    })

    if (Fail.is(result)) {
      const error = result.getValue()

      switch (error?.constructor) {
        case ResourceNotFoundError:
          throw new ConflictException(error)
        case NotAllowedError:
          throw new UnauthorizedException(error)
        default:
          throw new BadRequestException()
      }
    }
  }
}
