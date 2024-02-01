import { Controller, Delete, HttpCode, Param } from '@nestjs/common'

import { Fail } from '@/core/response-handling'

import { UserPayload } from '@/infra/auth/jwt.strategy'
import { CurrentUser } from '@/infra/auth/current-user.decorator'

import { DeleteQuestionCommentUseCase } from '@/domain/forum/application/use-cases/delete-question-comment'
import { httpErrorsTreatment } from '../../errors/http-treatment'

@Controller('/questions/comments/:id')
export class DeleteQuestionCommentController {
  constructor(
    private readonly deleteQuestionCommentUseCase: DeleteQuestionCommentUseCase,
  ) {}

  @Delete()
  @HttpCode(204)
  async handle(
    @CurrentUser() user: UserPayload,

    @Param('id') id: string,
  ) {
    const result = await this.deleteQuestionCommentUseCase.execute({
      id,
      authorId: user.sub,
    })

    if (Fail.is(result)) {
      httpErrorsTreatment(result)
    }
  }
}
