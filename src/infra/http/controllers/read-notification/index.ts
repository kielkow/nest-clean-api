import { Controller, HttpCode, Param, Patch } from '@nestjs/common'

import { Fail } from '@/core/response-handling'

import { UserPayload } from '@/infra/auth/jwt.strategy'
import { CurrentUser } from '@/infra/auth/current-user.decorator'

import { ReadNotificationUseCase } from '@/domain/notification/application/use-cases/read-notification'

import { httpErrorsTreatment } from '../../errors/http-treatment'

@Controller('/notifications/:id/read')
export class ReadNotificationController {
  constructor(
    private readonly readNotificationUseCase: ReadNotificationUseCase,
  ) {}

  @Patch()
  @HttpCode(204)
  async handle(
    @CurrentUser() user: UserPayload,

    @Param('id') id: string,
  ) {
    const result = await this.readNotificationUseCase.execute({
      id,
      recipientId: user.sub,
    })

    if (Fail.is(result)) {
      httpErrorsTreatment(result)
    }
  }
}
