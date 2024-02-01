import { Body, Controller, HttpCode, Param, Post } from '@nestjs/common'

import { Fail } from '@/core/response-handling'

import { UserPayload } from '@/infra/auth/jwt.strategy'
import { CurrentUser } from '@/infra/auth/current-user.decorator'

import { CommentOnAnswerUseCase } from '@/domain/forum/application/use-cases/comment-on-answer'

import { httpErrorsTreatment } from '../../errors/http-treatment'

import { ZodValidationPipe } from '../../pipes/zod-validation-pipe'

import {
  CommentOnAnswerDTO,
  CommentOnAnswerSchema,
} from '../../dtos/comment-on-answer.dto'

@Controller('/answers/:id/comments')
export class CommentOnAnswerController {
  constructor(
    private readonly commentOnAnswerUseCase: CommentOnAnswerUseCase,
  ) {}

  @Post()
  @HttpCode(204)
  async handle(
    @CurrentUser() user: UserPayload,

    @Param('id') id: string,

    @Body(new ZodValidationPipe(CommentOnAnswerSchema))
    data: CommentOnAnswerDTO,
  ) {
    const result = await this.commentOnAnswerUseCase.execute({
      authorId: user.sub,
      answerId: id,
      content: data.content,
    })

    if (Fail.is(result)) {
      httpErrorsTreatment(result)
    }
  }
}
