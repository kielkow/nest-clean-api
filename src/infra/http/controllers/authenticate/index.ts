import {
  BadRequestException,
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

import { Fail } from '@/core/response-handling'
import { ResourceNotFoundError } from '@/core/errors'

import { AuthenticateStudentUseCase } from '@/domain/forum/application/use-cases/authenticate-student'
import { AuthenticateError } from '@/domain/forum/application/use-cases/authenticate-student/errors/authenticate-error'

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
      const error = result.getValue()

      switch (error?.constructor) {
        case ResourceNotFoundError || AuthenticateError:
          throw new UnauthorizedException(error)
        default:
          throw new BadRequestException('Invalid credentials')
      }
    }

    const accessToken = result.getValue()

    return { access_token: accessToken }
  }
}
