import {
  Body,
  Controller,
  HttpCode,
  Post,
  UnauthorizedException,
} from '@nestjs/common'

import {
  AuthenticateSchema,
  AuthenticateSchemaDTO,
} from '@/infra/http/dtos/authenticate.dto'

import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipe'

import { AuthenticateStudentUseCase } from '@/domain/forum/application/use-cases/authenticate-student'
import { Fail } from '@/core/response-handling'

@Controller('/sessions')
export class AuthenticateController {
  constructor(private authenticateStudentUseCase: AuthenticateStudentUseCase) {}

  @Post()
  @HttpCode(201)
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
      throw new UnauthorizedException(result.getValue())
    }

    const accessToken = result.getValue()

    return { access_token: accessToken }
  }
}
