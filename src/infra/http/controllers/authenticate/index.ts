import { Body, Controller, HttpCode, Post } from '@nestjs/common'

import {
  AuthenticateSchema,
  AuthenticateSchemaDTO,
} from '@/infra/http/dtos/authenticate.dto'
import { Public } from '@/infra/auth/public'
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipe'

import { Fail } from '@/core/response-handling'

import { AuthenticateStudentUseCase } from '@/domain/forum/application/use-cases/authenticate-student'
import { httpErrorsTreatment } from '../../errors/http-treatment'

@Controller('/sessions')
@Public()
export class AuthenticateController {
  constructor(private authenticateStudentUseCase: AuthenticateStudentUseCase) {}

  @Post()
  @HttpCode(200)
  async handle(
    @Body(new ZodValidationPipe(AuthenticateSchema))
    data: AuthenticateSchemaDTO,
  ) {
    const { email, password } = data

    const result = await this.authenticateStudentUseCase.execute({
      email,
      password,
    })

    if (Fail.is(result)) {
      httpErrorsTreatment(result)
    }

    const accessToken = result.getValue()

    return { access_token: accessToken }
  }
}
