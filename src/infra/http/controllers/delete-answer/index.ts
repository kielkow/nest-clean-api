import {
  BadRequestException,
  Controller,
  Delete,
  HttpCode,
  Param,
  UnauthorizedException,
} from '@nestjs/common'

import { Fail } from '@/core/response-handling'
import { ResourceNotFoundError } from '@/core/errors'
import { UserPayload } from '@/infra/auth/jwt.strategy'
import { CurrentUser } from '@/infra/auth/current-user.decorator'

import { DeleteAnswerUseCase } from '@/domain/forum/application/use-cases/delete-answer'
import { AuthenticateError } from '@/domain/forum/application/use-cases/authenticate-student/errors/authenticate-error'

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
        case ResourceNotFoundError || AuthenticateError:
          throw new UnauthorizedException(error)
        default:
          throw new BadRequestException('Invalid credentials')
      }
    }
  }
}
