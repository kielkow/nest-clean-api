import { Controller, Delete, HttpCode, Param } from '@nestjs/common'

import { Fail } from '@/core/response-handling'

import { UserPayload } from '@/infra/auth/jwt.strategy'
import { CurrentUser } from '@/infra/auth/current-user.decorator'

import { DeleteAnswerUseCase } from '@/domain/forum/application/use-cases/delete-answer'
import { httpErrorsTreatment } from '../../errors/http-treatment'

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
      httpErrorsTreatment(result)
    }
  }
}
