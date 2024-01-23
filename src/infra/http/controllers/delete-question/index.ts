import { Controller, Delete, HttpCode, Param } from '@nestjs/common'

import { UserPayload } from '@/infra/auth/jwt.strategy'
import { CurrentUser } from '@/infra/auth/current-user.decorator'

import { DeleteQuestionUseCase } from '@/domain/forum/application/use-cases/delete-question'

@Controller('/questions/:id')
export class DeleteQuestionController {
  constructor(private readonly deleteQuestionUseCase: DeleteQuestionUseCase) {}

  @Delete()
  @HttpCode(204)
  async handle(
    @CurrentUser() user: UserPayload,

    @Param('id') id: string,
  ) {
    await this.deleteQuestionUseCase.execute({
      id,
      authorId: user.sub,
    })
  }
}
