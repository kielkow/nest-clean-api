import { Controller, HttpCode, Param, Patch } from '@nestjs/common'

import { Fail } from '@/core/response-handling'

import { UserPayload } from '@/infra/auth/jwt.strategy'
import { CurrentUser } from '@/infra/auth/current-user.decorator'

import { ChooseQuestionBestAnswerUseCase } from '@/domain/forum/application/use-cases/choose-question-best-answer'

import { httpErrorsTreatment } from '../../errors/http-treatment'

@Controller('/questions/:id/best-answer/:answerId')
export class ChooseQuestionBestAnswerController {
  constructor(
    private readonly chooseQuestionBestAnswerUseCase: ChooseQuestionBestAnswerUseCase,
  ) {}

  @Patch()
  @HttpCode(204)
  async handle(
    @CurrentUser() user: UserPayload,

    @Param('id') id: string,
    @Param('answerId') answerId: string,
  ) {
    const result = await this.chooseQuestionBestAnswerUseCase.execute({
      authorId: user.sub,
      answerId,
      questionId: id,
    })

    if (Fail.is(result)) {
      httpErrorsTreatment(result)
    }
  }
}
