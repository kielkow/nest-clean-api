import { Controller, Delete, HttpCode, Param } from '@nestjs/common'

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
    await this.deleteAnswerUseCase.execute({
      id,
      authorId: user.sub,
    })
  }
}
