import {
  BadRequestException,
  ConflictException,
  Controller,
  Delete,
  HttpCode,
  Param,
  UnauthorizedException,
} from '@nestjs/common'

import { Fail } from '@/core/response-handling'
import { NotAllowedError, ResourceNotFoundError } from '@/core/errors'

import { UserPayload } from '@/infra/auth/jwt.strategy'
import { CurrentUser } from '@/infra/auth/current-user.decorator'

import { DeleteAnswerUseCase } from '@/domain/forum/application/use-cases/delete-answer'

@Controller('/answers/:id')
export class DeleteAnswerController {
  constructor(private readonly deleteAnswerUseCase: DeleteAnswerUseCase) {}

  @Delete()
  @HttpCode(204)
  async handle(
    @CurrentUser() user: UserPayload,

    @Param('id') id: string,
  ) {
    const result = await this.deleteAnswerUseCase.execute({
      id,
      authorId: user.sub,
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
