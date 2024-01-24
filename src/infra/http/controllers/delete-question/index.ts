import { Controller, Delete, HttpCode, Param } from '@nestjs/common'

import { Fail } from '@/core/response-handling'

import { UserPayload } from '@/infra/auth/jwt.strategy'
import { CurrentUser } from '@/infra/auth/current-user.decorator'

import { DeleteQuestionUseCase } from '@/domain/forum/application/use-cases/delete-question'
import { httpErrorsTreatment } from '../../errors/http-treatment'

@Controller('/questions/:id')
export class DeleteQuestionController {
  constructor(private readonly deleteQuestionUseCase: DeleteQuestionUseCase) {}

  @Delete()
  @HttpCode(204)
  async handle(
    @CurrentUser() user: UserPayload,

    @Param('id') id: string,
  ) {
    const result = await this.deleteQuestionUseCase.execute({
      id,
      authorId: user.sub,
    })

    if (Fail.is(result)) {
      httpErrorsTreatment(result)
    }
  }
}
