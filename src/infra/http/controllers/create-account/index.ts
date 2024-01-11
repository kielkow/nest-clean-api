import {
  BadRequestException,
  Body,
  ConflictException,
  Controller,
  HttpCode,
  Post,
} from '@nestjs/common'

import { Fail } from '@/core/response-handling'
import { ResourceAlreadyExistsError } from '@/core/errors'

import { Public } from '@/infra/auth/public'
import {
  CreateAccountSchema,
  CreateAccountDTO,
} from '@/infra/http/dtos/create-account.dto'
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipe'

import { CreateStudentUseCase } from '@/domain/forum/application/use-cases/create-student'

@Controller('/accounts')
@Public()
export class CreateAccoutController {
  constructor(private readonly createStudentUseCase: CreateStudentUseCase) {}

  @Post()
  @HttpCode(201)
  async handle(
    @Body(new ZodValidationPipe(CreateAccountSchema))
    data: CreateAccountDTO,
  ) {
    const result = await this.createStudentUseCase.execute(data)

    if (Fail.is(result)) {
      const error = result.getValue()

      switch (error?.constructor) {
        case ResourceAlreadyExistsError:
          throw new ConflictException(error)
        default:
          throw new BadRequestException(error)
      }
    }

    return result.getValue()
  }
}
