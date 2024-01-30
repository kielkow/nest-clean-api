import { Body, Controller, HttpCode, Param, Post } from '@nestjs/common'

import { Fail } from '@/core/response-handling'

import { UserPayload } from '@/infra/auth/jwt.strategy'
import { CurrentUser } from '@/infra/auth/current-user.decorator'

import { CommentOnQuestionUseCase } from '@/domain/forum/application/use-cases/comment-on-question'

import { httpErrorsTreatment } from '../../errors/http-treatment'

import { ZodValidationPipe } from '../../pipes/zod-validation-pipe'

import {
  CommentOnQuestionDTO,
  CommentOnQuestionSchema,
} from '../../dtos/comment-on-question.dto'

@Controller('/questions/:id/comments')
export class CommentOnQuestionController {
  constructor(
    private readonly commentOnQuestionUseCase: CommentOnQuestionUseCase,
  ) {}

  @Post()
  @HttpCode(204)
  async handle(
    @CurrentUser() user: UserPayload,

    @Param('id') id: string,

    @Body(new ZodValidationPipe(CommentOnQuestionSchema))
    data: CommentOnQuestionDTO,
  ) {
    const result = await this.commentOnQuestionUseCase.execute({
      authorId: user.sub,
      questionId: id,
      content: data.content,
    })

    if (Fail.is(result)) {
      httpErrorsTreatment(result)
    }
  }
}
