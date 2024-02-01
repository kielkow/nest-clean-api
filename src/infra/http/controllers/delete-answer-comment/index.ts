import { Controller, Delete, HttpCode, Param } from '@nestjs/common'

import { Fail } from '@/core/response-handling'

import { UserPayload } from '@/infra/auth/jwt.strategy'
import { CurrentUser } from '@/infra/auth/current-user.decorator'

import { DeleteAnswerCommentUseCase } from '@/domain/forum/application/use-cases/delete-answer-comment'
import { httpErrorsTreatment } from '../../errors/http-treatment'

@Controller('/answers/comments/:id')
export class DeleteAnswerCommentController {
  constructor(
    private readonly deleteAnswerCommentUseCase: DeleteAnswerCommentUseCase,
  ) {}

  @Delete()
  @HttpCode(204)
  async handle(
    @CurrentUser() user: UserPayload,

    @Param('id') id: string,
  ) {
    const result = await this.deleteAnswerCommentUseCase.execute({
      id,
      authorId: user.sub,
    })

    if (Fail.is(result)) {
      httpErrorsTreatment(result)
    }
  }
}
