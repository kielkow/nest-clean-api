import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  Post,
} from '@nestjs/common'

import { Fail } from '@/core/response-handling'

import {
  CreateAccountSchema,
  CreateAccountDTO,
} from '@/infra/http/dtos/create-account.dto'

import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipe'

import { CreateStudentUseCase } from '@/domain/forum/application/use-cases/create-student'

@Controller('/accounts')
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
      throw new BadRequestException(result.getValue())
    }

    return result.getValue()
  }
}
